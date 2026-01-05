'use client';

export default function StartMenu({ isOpen, onClose, menuItems }) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div 
        className="win95-window fixed bottom-8 left-2 z-50"
        style={{ width: '200px' }}
      >
        <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-1">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-2"
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

