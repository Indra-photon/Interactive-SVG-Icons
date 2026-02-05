'use client';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="mt-2 px-4 py-2 font-sans tracking-tighter bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
    >
      Copy Command
    </button>
  );
}