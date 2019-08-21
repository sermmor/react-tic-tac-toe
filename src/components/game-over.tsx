import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { GameResult } from '../model/board';

interface Props {
  gameResult: GameResult,
}

export const GameOverDialog = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('Game Over');
  const [infoDialog, setInfoDialog] = React.useState('You lose');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!open && props.gameResult !== GameResult.Running) {
    setOpen(true);
    if (props.gameResult === GameResult.PlayerWins) {
      setTitle('VICTORY!');
      setInfoDialog('You win!');
    } else if (props.gameResult === GameResult.Draw) {
      setTitle('Game Over');
      setInfoDialog('Draw');
    }
  }

  const handleClose = React.useCallback(() => {
    setOpen(false);
    location.reload();
  }, []);

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {infoDialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Reset game
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}