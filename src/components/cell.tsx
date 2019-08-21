import * as React from 'react';
import { CellInfo } from '../model/board';
import { GameStatus } from './game';

const imageXPath = 'images/X-300.png';
const imageOPath = 'images/O-300.png';

const cellSize: React.CSSProperties = {
  width: 100,
  height: 100,
}

const genericCellStyle: React.CSSProperties = {
  ...cellSize,
  border: "10px solid #383838",
  textAlign: "center",
  fontSize: "5.5em",
  color: "#383838",
}

const styleCellCleaned: React.CSSProperties = {
  backgroundColor: "#BEBEBE",
  cursor: "pointer",
};

const styleCellHumanMark: React.CSSProperties = {
  backgroundColor: "#4FFF8C",
};

const styleCellMachineMark: React.CSSProperties = {
  backgroundColor: "#FF4F4F",
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
  const [cellImagePath, setCellImagePath] = React.useState('');
  const [cellStyle, setCellStyle] = React.useState(buildCellStyle(props.cellType))

  const onChangeCell = React.useCallback(() => {
    if (props.isInPlayerTurn) {
      // Player turn.
      props.onChangeCell();
      setCellImagePath(imageOPath)
      setCellStyle(buildCellStyle(CellInfo.PlayerMark));
    }
  }, []);

  if (props.cellType === CellInfo.MachineMark && cellImagePath !== imageXPath) {
    // Machine turn.
    setCellImagePath(imageXPath);
    setCellStyle(buildCellStyle(CellInfo.MachineMark));
  }

  return (
    <div style={cellStyle} onClick={onChangeCell}>
      <img src={cellImagePath} style={cellSize}/>
    </div>
  );
}
