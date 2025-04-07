export default function LoadingSpinner({ size = 40 }) {
    return (
      <div className="flex justify-center items-center p-4">
        <div 
          className="border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          style={{ width: size, height: size }}
        ></div>
      </div>
    );
  }