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

module.exports = {
  selectAll,
  selectIdentity,
  selectNone,
  selectReverse
};
