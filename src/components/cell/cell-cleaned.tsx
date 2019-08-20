import * as React from 'react';

const styleCellCleaned: React.CSSProperties = {
  backgroundColor: "gray",
  cursor: "pointer",
};

interface Props {
  genericCellStyle: React.CSSProperties;
  isPlayingMachine: boolean;
  onChangeCell: () => void;
}

const buildCellStyle = (genericCellStyle: React.CSSProperties): React.CSSProperties => {
  return {
    ...genericCellStyle,
    ...styleCellCleaned
  }
}

export const CellCleaned = (props: Props) => {
  const onChangeCell = React.useCallback(() => {
    if (!props.isPlayingMachine) {
      props.onChangeCell();
    }
  }, []);
  return (<div style={buildCellStyle(props.genericCellStyle)} onClick={onChangeCell}></div>);
}
