import ParticlesBg from 'particles-bg';
import './Background.css';
import { useTheme } from '@material-ui/core/styles';

export default function Background(props) {
  const theme = useTheme();
  return (
    <ParticlesBg
      num={props.num || 80}
      type="cobweb"
      color={`${theme.palette.secondary.light}`}
      bg={props.bg || true}
    />
  );
}
