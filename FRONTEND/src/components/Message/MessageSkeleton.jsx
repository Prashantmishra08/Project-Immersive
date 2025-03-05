import useThemeStore from "../../zustand/useThemeStore"; // ✅ Theme Store Import किया

const MessageSkeleton = () => {
  const { isDark } = useThemeStore(); // ✅ Dark Mode State Used

  return (
    <>
      {/* Left Side Skeleton */}
      <div className="flex gap-3 items-center">
        <div
          className={`w-10 h-10 rounded-full shrink-0 ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
        <div className="flex flex-col gap-1">
          <div
            className={`h-4 w-40 rounded-md ${
              isDark ? "bg-gray-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`h-4 w-40 rounded-md ${
              isDark ? "bg-gray-600" : "bg-gray-200"
            }`}
          ></div>
        </div>
      </div>

      {/* Right Side Skeleton */}
      <div className="flex gap-3 items-center justify-end">
        <div className="flex flex-col gap-1">
          <div
            className={`h-4 w-40 rounded-md ${
              isDark ? "bg-gray-600" : "bg-gray-200"
            }`}
          ></div>
        </div>
        <div
          className={`w-10 h-10 rounded-full shrink-0 ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        ></div>
      </div>
    </>
  );
};

export default MessageSkeleton;
