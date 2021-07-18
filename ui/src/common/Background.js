import ParticlesBg from 'particles-bg';
import { COLORS } from './Theme';

export default function Background(props) {
  return <ParticlesBg num={props.num || 80} type="cobweb" color={COLORS[5]} bg={true} />;
}
