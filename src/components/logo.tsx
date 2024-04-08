import { motion } from "framer-motion";
import { cn } from "~/components/utils";

export const Logo = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      layoutId="monoverse-logo"
      transition={{ type: "spring", duration: 0.5 }}
      className={cn("text-center text-6xl font-medium text-primary", className)}
      onClick={onClick}
    >
      monoverse
    </motion.button>
  );
};
