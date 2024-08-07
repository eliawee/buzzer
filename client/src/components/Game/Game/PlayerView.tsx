export default ({ onBuzz }: IProps) => {
  return <button onClick={onBuzz}>BUZZ</button>;
};

type IProps = {
  onBuzz: () => void;
};
