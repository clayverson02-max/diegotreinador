import diegoAvatar from "@/assets/diego-avatar.jpg";

interface DiegoAvatarProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export const DiegoAvatar = ({ size = "md", animate = false }: DiegoAvatarProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-24 h-24",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden diego-glow ${
        animate ? "animate-float" : ""
      }`}
    >
      <img 
        src={diegoAvatar} 
        alt="Diego - Seu instrutor digital"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
