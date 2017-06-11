function selectAll(artists) {
  let selection = {};
  let selectionCount = 0;
  let addTrack = track => {
    selection[track.id] = track;
    selectionCount++;
  };
  artists.forEach(artist => {
    artist.topTracks.forEach(addTrack);
  });
  return { selection, selectionCount, mostRecentSelection: null };
}

function selectNone() {
  return { selection: {}, selectionCount: 0, mostRecentSelection: null };
}

function selectReverse(artists, selection) {
  let newSelection = {};
  let selectionCount = 0;
  let maybeAddTrack = track => {
    if (!selection[track.id]) {
      newSelection[track.id] = track;
      selectionCount++;
    }
  };
  artists.forEach(artist => {
    artist.topTracks.forEach(maybeAddTrack);
  });
  return { selection: newSelection, selectionCount, mostRecentSelection: null };
}

module.exports = {
  selectAll,
  selectNone,
  selectReverse
};
