import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface DropdownItem {
  title: string;
  url: string;
  disabled?: boolean;
  badge?: number;
}

interface AdminCustomDropdownProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: DropdownItem[];
  isActive?: boolean;
  badge?: number;
  className?: string;
}

export default function AdminCustomDropdown({
  title,
  icon: Icon,
  items,
  isActive = false,
  badge,
  className = "",
}: AdminCustomDropdownProps) {
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

  // Sidebar menu button styling from sidebar.tsx
  const buttonClasses = `peer/menu-button flex w-full items-center justify-between gap-3 overflow-hidden rounded-md px-3 py-2 text-sm font-medium outline-hidden ring-primary-foreground/30 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-2 active:bg-primary-foreground/15 active:text-primary-foreground disabled:pointer-events-none disabled:opacity-50 ${
    isActive
      ? "bg-primary-foreground/15 font-medium text-primary-foreground"
      : "text-primary-foreground/80"
  }${className ? ` ${className}` : ""}`;

  // Desktop dropdown content
  const renderDropdownContent = () => (
    <div className="mt-1 ml-6 space-y-1">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
            item.disabled
              ? "text-muted-foreground cursor-not-allowed"
              : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          }`}
          onClick={() => {
            if (!item.disabled) {
              setIsOpen(false);
            }
          }}
        >
          <div className="flex justify-between items-center">
            <span>{item.title}</span>
            {item.badge && item.badge > 0 ? (
              <Badge variant="destructive" className="ml-2">{item.badge}</Badge>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );

  // Mobile sheet content
  const renderSheetContent = () => (
    <SheetContent side="left" className="overflow-y-auto max-h-screen">
      <div className="py-4 space-y-2">
        <div className="flex items-center gap-3 px-4 mb-2 text-background">
          <Icon className="h-5 w-5" />
          <h3 className="font-medium">{title}</h3>
          {badge && badge > 0 ? (
            <Badge variant="destructive">{badge}</Badge>
          ) : null}
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`block px-4 py-2 text-sm transition-colors ${
                item.disabled
                  ? "text-muted-foreground cursor-not-allowed"
                  : "text-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{item.title}</span>
                {item.badge && item.badge > 0 ? (
                  <Badge variant="destructive" className="ml-2">{item.badge}</Badge>
                ) : null}
              </div>
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
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {badge && badge > 0 ? (
              <Badge variant="destructive">{badge}</Badge>
            ) : null}
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      </SheetTrigger>
      {renderSheetContent()}
    </Sheet>
  ) : (
    <div className="w-full" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={buttonClasses}>
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && badge > 0 ? (
            <Badge variant="destructive">{badge}</Badge>
          ) : null}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && renderDropdownContent()}
    </div>
  );
}
