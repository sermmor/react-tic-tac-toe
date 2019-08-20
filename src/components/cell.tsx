import * as React from 'react';
import { CellType } from '../model/board';

const genericCellStyle: React.CSSProperties = {
  width: 100,
  height: 100,
  border: "10px solid white",
  textAlign: "center",
  fontSize: "5.5em",
}

const styleCellCleaned: React.CSSProperties = {
  backgroundColor: "gray",
  cursor: "pointer",
};

const styleCellHumanMark: React.CSSProperties = {
  backgroundColor: "green",
};

const styleCellMachineMark: React.CSSProperties = {
  backgroundColor: "red",
};

interface Props {
  cellType: CellType;
  isPlayingMachine: boolean;
  onChangeCell: () => void;
}

const buildCellStyle = (cellType: CellType): React.CSSProperties => {
  const styleCell = cellType === CellType.HumanMark ? styleCellHumanMark : (
    cellType == CellType.MachineMark ? styleCellMachineMark : styleCellCleaned
  );
  return {
    ...genericCellStyle,
    ...styleCell
  }
}

export const Cell = (props: Props) => {
  const [cellText, setCellText] = React.useState('');
  const [cellStyle, setCellStyle] = React.useState(buildCellStyle(props.cellType))

  const onChangeCell = React.useCallback(() => {
    if (!props.isPlayingMachine) {
      props.onChangeCell();
      setCellText('O')
      setCellStyle(buildCellStyle(CellType.HumanMark));
    }
  }, []);

  // TODO: Review 'X' machine turn.
  // const style = buildCellStyle(props.genericCellStyle, props.cellType);

  return (
    <div style={cellStyle} onClick={onChangeCell}>{cellText}</div>
  );
}
