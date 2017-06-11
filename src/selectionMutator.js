function selectIdentity(artists, selection) {
  let selectionCount = 0;
  let selectionDurationMs = 0;
  let trackCount = 0;

  let processTrack = track => {
    if (selection[track.id]) {
      selectionCount++;
      selectionDurationMs += track.duration_ms;
    }
    trackCount++;
  };
  artists.forEach(artist => {
    artist.topTracks.forEach(processTrack);
  });
  return { selection, selectionCount, selectionDurationMs, mostRecentSelection: null, trackCount };
}

function selectAll(artists) {
  let selection = {};
  let addTrack = track => {
    selection[track.id] = track;
  };
  artists.forEach(artist => {
    artist.topTracks.forEach(addTrack);
  });
  return selectIdentity(artists, selection);
}

function selectNone(artists) {
  return selectIdentity(artists, {});
}

function selectReverse(artists, selection) {
  let newSelection = {};
  let maybeAddTrack = track => {
    if (!selection[track.id]) {
      newSelection[track.id] = track;
    }
  };
  artists.forEach(artist => {
    artist.topTracks.forEach(maybeAddTrack);
  });
  return selectIdentity(artists, newSelection);
}

function selectRandom(artists) {
  let newSelection = {};
  let allTracks = [];

  let addTrack = track => {
    allTracks.push(track);
  };

  artists.forEach(artist => {
    artist.topTracks.forEach(addTrack);
  });

  let selectedTracks = [];
  // Choose 100 tracks optimally, or up to a third of all tracks
  const numToSelect = Math.min(100, allTracks.length / 3);
  while (selectedTracks.length < numToSelect) {
    let idx = Math.floor(Math.random() * allTracks.length);
    let track = allTracks[idx];
    // If a track is already selected, pick one that follows
    while (track && newSelection[track.id]) {
      idx += 2;
      track = allTracks[idx];
    }
    if (track) {
      selectedTracks.push(track);
    }
  }
  selectedTracks.forEach(track => {
    newSelection[track.id] = track;
  });
  return selectIdentity(artists, newSelection);
}

module.exports = {
  selectAll,
  selectIdentity,
  selectNone,
  selectRandom,
  selectReverse
};
