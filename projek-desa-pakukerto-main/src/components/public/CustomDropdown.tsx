import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface DropdownItem {
  name: string;
  href: string;
}

interface CustomDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  isActive?: boolean;
  className?: string;
}

export default function CustomDropdown({
  trigger,
  items,
  isActive = false,
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Button styling consistent with navbar
  const buttonClasses = `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
    isActive ? "text-primary" : "text-foreground"
  }`;

  // Desktop dropdown content
  const renderDropdownContent = () => (
    <div className="absolute top-full -left-25 mt-1 w-56 bg-background border border-border rounded-md shadow-lg z-50">
      <div className="py-1">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );

  // Mobile sheet content with scrolling
  const renderSheetContent = () => (
    <SheetContent side="right" className="overflow-y-auto max-h-screen">
      <div className="py-4 space-y-2">
        <div className="flex items-center gap-2 px-4 mb-4">
          <h3 className="font-medium">
            {typeof trigger === "string" ? trigger : "Menu"}
          </h3>
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </SheetContent>
  );

  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <button className={buttonClasses}>
          {trigger}
          <ChevronDown className="h-3 w-3" />
        </button>
      </SheetTrigger>
      {renderSheetContent()}
    </Sheet>
  ) : (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={buttonClasses}>
        {trigger}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && renderDropdownContent()}
    </div>
  );
}
