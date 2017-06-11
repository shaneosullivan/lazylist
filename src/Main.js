import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import CreateButton from './CreateButton';
import GridColumn from './GridColumn';
import GridColumnHeader from './GridColumnHeader';
import Loading from './Loading';
import MenuButton from './MenuButton';
import SelectButton from './SelectButton';
import IntroScreen from './IntroScreen';
import ExportPlaylist from './ExportPlaylist';
import throttle from './throttle';
import states from './states';
import selectionMutator from './selectionMutator';

const GRID_CELL_SIZE = 180;
const LOCAL_STORAGE_KEY = '__top_artists__';
const NUM_ARTISTS = 50;
const NUM_TRACKS = 50;
const MAX_TRACKS = 10;
const MAX_TRACKS_PER_PLAYLIST_ADDITION = 100;
const SCROLL_BUFFER = GRID_CELL_SIZE * 2;

const VERSION = 1;

class Main extends Component {
  constructor() {
    super();
    this.state = {
      spotify: null,
      state: states.LOADING,
      artists: [],
      trackCount: 0,
      selection: {},
      mostRecentSelection: null,
      selectionCount: 0,
      percentComplete: 0,
      scrollX: window.scrollX,
      containerWidth: window.innerWidth
    };
  }

  componentWillMount() {
    if (!this.props.accessToken) {
      throw new Error('The Main component should not be rendered without a valid accessToken prop');
    }
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(this.props.accessToken);
    this.setState(
      {
        spotify: spotifyApi,
        state: states.LOADING
      },
      () => {
        this._fetchData();
      }
    );

    // Kind of nasty to listen to global scroll events here.
    // YOLO.
    this._handleScroll = throttle(this._handleScroll, 250);
    window.addEventListener('scroll', this._handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll, false);
  }

  render() {
    const artists = this.state.artists;
    let content;
    let width = 'inherit';
    if (artists.length > 0) {
      width = GRID_CELL_SIZE * artists.length + 'px';
      content = (
        <div className="grid-outer" style={{ width }}>
          <div className="grid-header">
            {artists.map(this._renderColumnHeader)}
          </div>
          <div className="grid-body">
            {artists.map(this._renderColumn)}
            <CreateButton
              selectionCount={this.state.selectionCount}
              state={this.state.state}
              onCreate={this._createPlaylist}
              onEdit={this._editPlaylistName}
            />
            <MenuButton />
            <SelectButton
              trackCount={this.state.trackCount}
              onSelectAll={this._handleSelectAll}
              onSelectNone={this._handleSelectNone}
              onSelectReverse={this._handleSelectReverse}
            />
            <IntroScreen />
            {this.state.state === states.EDITING_PLAYLIST_NAME ||
              this.state.state === states.CREATING_PLAYLIST ||
              this.state.state === states.PLAYLIST_CREATED
              ? <ExportPlaylist
                  onExport={this._createPlaylist}
                  onClose={this._handleModalClose}
                  state={this.state.state}
                />
              : null}
          </div>
        </div>
      );
    } else {
      content = <Loading percentComplete={this.state.percentComplete} />;
    }
    return (
      <div className="main" style={{ width }}>
        {content}
      </div>
    );
  }

  _renderColumnHeader = artist => {
    return <GridColumnHeader artist={artist} key={artist.id} onArtistToggle={this._toggleArtist} />;
  };

  _renderColumn = (artist, idx) => {
    const leftColPos = idx * GRID_CELL_SIZE;
    const imagesVisible = leftColPos > this.state.scrollX - SCROLL_BUFFER &&
      leftColPos < this.state.scrollX + this.state.containerWidth + SCROLL_BUFFER;
    return (
      <GridColumn
        artist={artist}
        key={artist.id}
        imagesVisible={imagesVisible}
        selection={this.state.selection}
        mostRecentSelection={this.state.mostRecentSelection}
        onArtistToggle={this._toggleArtist}
        onTrackToggle={this._toggleTrack}
      />
    );
  };

  _editPlaylistName = () => {
    this.setState({ state: states.EDITING_PLAYLIST_NAME });
  };

  _createPlaylist = (name: string) => {
    const spotify = this.state.spotify;

    this.setState({ state: states.CREATING_PLAYLIST });

    spotify
      .getMe()
      .then(me => {
        spotify
          .createPlaylist(me.id, {
            name: name || 'New Playlist ' + Date.now()
          })
          .then(playlist => {
            let uris = [];
            const selection = this.state.selection;
            for (let id in selection) {
              uris.push(selection[id].uri);
            }

            // Only possible to do max of 100 tracks per addition so chunk it
            let promises = [];
            for (let i = 0; i < uris.length; i += MAX_TRACKS_PER_PLAYLIST_ADDITION) {
              let trackUris = uris.slice(i, i + MAX_TRACKS_PER_PLAYLIST_ADDITION);
              promises.push(spotify.addTracksToPlaylist(me.id, playlist.id, trackUris));
            }
            Promise.all(promises)
              .then(() => {
                this.setState({ state: states.PLAYLIST_CREATED });

                setTimeout(
                  () => {
                    if (this.state.state === states.PLAYLIST_CREATED) {
                      this.setState({ state: states.SELECTING });
                    }
                  },
                  2000
                );
              })
              .catch(() => {
                alert('Failed to add tracks to playlist ');
                this.setState({ state: states.SELECTING });
              });
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  _toggleTrack = track => {
    let selection = this.state.selection;
    if (selection[track.id]) {
      delete selection[track.id];
    } else {
      selection[track.id] = track;
    }

    this.setState({
      selection,
      selectionCount: this.state.selectionCount + (selection[track.id] ? 1 : -1),
      mostRecentSelection: selection[track.id] ? track.id : null
    });
  };

  _toggleArtist = artist => {
    let selection = this.state.selection;

    let anyDeselected = artist.topTracks.some(track => {
      return !selection[track.id];
    });

    let changedCount = 0;
    artist.topTracks.forEach(track => {
      if (anyDeselected) {
        if (!selection[track.id]) {
          changedCount++;
          selection[track.id] = track;
        }
      } else if (selection[track.id]) {
        changedCount--;
        delete selection[track.id];
      }
    });

    this.setState({
      selection,
      selectionCount: this.state.selectionCount + changedCount,
      mostRecentSelection: null
    });
  };

  _handleScroll = (evt: any) => {
    this.setState({
      scrollX: window.scrollX,
      containerWidth: window.innerWidth
    });
  };

  _handleModalClose = () => {
    this.setState({ state: states.SELECTING });
  };

  _handleSelectAll = () => {
    this.setState(selectionMutator.selectAll(this.state.artists));
  };
  _handleSelectNone = () => {
    this.setState(selectionMutator.selectNone(this.state.artists));
  };
  _handleSelectReverse = () => {
    this.setState(selectionMutator.selectReverse(this.state.artists, this.state.selection));
  };

  _fetchData() {
    let topArtists = [];
    let topArtistsFromTracks = {};
    let existingArtistIDs = {};
    const spotify = this.state.spotify;
    let artistCounter = 0;
    const timeRanges = ['medium_term', 'long_term', 'short_term'];
    let topTrackIDs = {};
    let initialSelection = {};
    let initialSelectionCount = 0;

    const finalizeData = () => {
      let trackCount = 0;
      topArtists.forEach(artist => trackCount += artist.topTracks.length);

      this.setState(
        {
          artists: topArtists,
          selection: initialSelection,
          selectionCount: initialSelectionCount,
          percentComplete: 100,
          state: states.SELECTING,
          trackCount
        },
        () => {
          try {
            window.localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify({
                version: VERSION,
                expires: Date.now() + 1000 * 60 * 60,
                artists: topArtists,
                selection: initialSelection,
                selectionCount: initialSelectionCount
              })
            );
          } catch (e) {}
        }
      );
    };

    let percentComplete = 0;
    const setPercentComplete = value => {
      percentComplete = Math.ceil(Math.max(percentComplete, value));
      this.setState({ percentComplete });
    };

    try {
      // Use a locally stored version if possible
      const topArtistsStr = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!this.props.noCache && topArtistsStr) {
        const topArtistsData = JSON.parse(topArtistsStr);
        if (topArtistsData.expires > Date.now() && topArtistsData.version === VERSION) {
          topArtists = topArtistsData.artists;
          initialSelection = topArtistsData.selection;
          initialSelectionCount = topArtistsData.selectionCount;
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
          initialSelectionCount++;
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
        spotify.getArtistTopTracks(artist.id, 'US').then(callback.bind(this, artist), errorHandler);
        return true;
      });
    }

    fetchMyTopTracks();
  }
}

export default Main;
