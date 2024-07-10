interface Props {
  selected: string;
  setSelected: (name: string) => void;
  items: {
    name: string;
  }[];
}
export const Nav = ({ items, selected, setSelected }: Props) => {
  return (
    <nav className="flex justify-between">
      {items.map((item) => (
        <button
          key={item.name}
          className={`${
            selected === item.name ? "bg-gray-200" : ""
          } rounded px-3 py-1`}
          onClick={() => setSelected(item.name)}
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
};
