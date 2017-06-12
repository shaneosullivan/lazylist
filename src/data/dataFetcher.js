import selectionMutator from '../selectionMutator';
import states from '../states';

const LOCAL_STORAGE_KEY = '__top_artists_v2__';

const MAX_TRACKS = 10;
const NUM_ARTISTS = 50;
const NUM_TRACKS = 50;
const VERSION = 1;

export default function dataFetcher(spotify, noCache, percentCallback, finalCallback) {
  let topArtists = [];
  let topArtistsFromTracks = {};
  let existingArtistIDs = {};
  let artistCounter = 0;
  const timeRanges = ['medium_term', 'long_term', 'short_term'];
  let topTrackIDs = {};
  let initialSelection = {};

  const finalizeData = () => {
    finalCallback(
      {
        artists: topArtists,
        percentComplete: 100,
        state: states.SELECTING,
        ...selectionMutator.selectIdentity(topArtists, initialSelection)
      },
      () => {
        try {
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              version: VERSION,
              expires: Date.now() + 1000 * 60 * 60,
              artists: topArtists,
              selection: initialSelection
            })
          );
        } catch (e) {}
      }
    );
  };

  let percentComplete = 0;
  const setPercentComplete = value => {
    percentComplete = Math.ceil(Math.max(percentComplete, value));
    percentCallback(percentComplete);
  };

  try {
    // Use a locally stored version if possible
    const topArtistsStr = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!noCache && topArtistsStr) {
      const topArtistsData = JSON.parse(topArtistsStr);
      if (topArtistsData.expires > Date.now() && topArtistsData.version === VERSION) {
        topArtists = topArtistsData.artists;
        initialSelection = topArtistsData.selection;
        finalizeData();
        return;
      }
    }
  } catch (e) {
    console.log('Caught ', e);
    topArtists = [];
  }

  function addTopArtist(artist) {
    if (!existingArtistIDs[artist.id]) {
      existingArtistIDs[artist.id] = true;
      topArtists.push(artist);
      artist.topTracks = topArtistsFromTracks[artist.id] || [];
    }
  }

  function addTopArtistFromTrack(track) {
    if (topTrackIDs[track.id]) {
      return;
    }
    topTrackIDs[track.id] = true;
    track.artists.forEach(artist => {
      const id = artist.id;
      if (!topArtistsFromTracks[id]) {
        topArtistsFromTracks[id] = [];
      }
      if (topArtistsFromTracks[id].length < MAX_TRACKS) {
        topArtistsFromTracks[id].push(track);
        initialSelection[track.id] = track;
      }
    });
  }

  const MY_TOP_TRACKS_TOTAL_PERC = 15;
  function fetchMyTopTracks() {
    let completeCount = 0;
    timeRanges.forEach(timeRange => {
      spotify.getMyTopTracks({ limit: NUM_ARTISTS, time_range: timeRange }).then(
        data => {
          data.items.forEach(addTopArtistFromTrack);
          completeCount++;
          setPercentComplete(completeCount * MY_TOP_TRACKS_TOTAL_PERC / timeRanges.length);
          if (completeCount === timeRanges.length) {
            fetchTopArtists();
          }
        },
        err => {
          console.error(err);
        }
      );
    });
  }

  const MY_TOP_ARTISTS_TOTAL_PERC = 30;
  function fetchTopArtists() {
    let completeCount = 0;
    timeRanges.forEach(timeRange => {
      spotify.getMyTopArtists({ limit: NUM_TRACKS, time_range: timeRange }).then(
        data => {
          data.items.forEach(addTopArtist);
          completeCount++;
          setPercentComplete(
            MY_TOP_TRACKS_TOTAL_PERC +
              completeCount *
                (MY_TOP_ARTISTS_TOTAL_PERC - MY_TOP_TRACKS_TOTAL_PERC) /
                timeRanges.length
          );
          if (completeCount === timeRanges.length) {
            fetchTopTracksForMultipleArtists();
          }
        },
        err => {
          console.error(err);
        }
      );
    });
  }

  const MY_TOP_ARTISTS_TRACKS_TOTAL_PERC = 100;
  function fetchTopTracksForMultipleArtists() {
    for (let i = 0; i < 4; i++) {
      fetchTopTracksForNextArtist();
    }
  }

  let fetchedArtists = {};
  function fetchTopTracksForNextArtist() {
    const callback = (artist, data) => {
      // Filter out any tracks we've already gotten from the users top tracks
      artist.topTracks = (artist.topTracks || [])
        .concat(data.tracks.filter(track => !topTrackIDs[track.id]));

      if (artist.topTracks.length > MAX_TRACKS) {
        artist.topTracks = artist.topTracks.slice(0, MAX_TRACKS);
      }
      artistCounter++;
      setPercentComplete(
        MY_TOP_ARTISTS_TOTAL_PERC +
          (MY_TOP_ARTISTS_TRACKS_TOTAL_PERC - MY_TOP_ARTISTS_TOTAL_PERC) *
            artistCounter /
            topArtists.length
      );
      if (artistCounter < topArtists.length) {
        // Get the next artist
        fetchTopTracksForNextArtist();
      } else {
        finalizeData();
      }
    };
    const errorHandler = err => {
      console.error(err);
    };

    return topArtists.some(artist => {
      if (fetchedArtists[artist.id]) {
        return false;
      }
      fetchedArtists[artist.id] = true;
      spotify.getArtistTopTracks(artist.id, 'US').then(callback.bind(null, artist), errorHandler);
      return true;
    });
  }

  fetchMyTopTracks();
}
