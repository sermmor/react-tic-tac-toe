import * as React from 'react';
import { CellInfo } from '../model/board';
import { GameStatus } from './game';

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
  gameStatus: GameStatus;
  cellType: CellInfo;
  isInPlayerTurn: boolean;
  onChangeCell: () => void;
}

const buildCellStyle = (cellType: CellInfo): React.CSSProperties => {
  const styleCell = cellType === CellInfo.PlayerMark ? styleCellHumanMark : (
    cellType == CellInfo.MachineMark ? styleCellMachineMark : styleCellCleaned
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
    if (props.isInPlayerTurn) {
      // Player turn.
      props.onChangeCell();
      setCellText('O')
      setCellStyle(buildCellStyle(CellInfo.PlayerMark));
    }
  }, []);

  if (props.cellType === CellInfo.MachineMark && cellText !== 'X') {
    // Machine turn.
    setCellText('X');
    setCellStyle(buildCellStyle(CellInfo.MachineMark));
  }

  return (
    <div style={cellStyle} onClick={onChangeCell}>{cellText}</div>
  );
}
