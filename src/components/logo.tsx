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
      transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
      className={cn("text-center text-6xl font-medium text-primary", className)}
      onClick={onClick}
    >
      monoverse
    </motion.button>
  );
};
