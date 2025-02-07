import "../styles/animation.css"

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center space-x-2 w-full h-full min-h-[200px]">
      <div className="w-4 h-4 bg-primary rounded-full animate-[bounce_1.4s_infinite] bounce-1"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-[bounce_1.4s_infinite] bounce-2"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-[bounce_1.4s_infinite] bounce-3"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-[bounce_1.4s_infinite]"></div>
    </div>
  )
}
