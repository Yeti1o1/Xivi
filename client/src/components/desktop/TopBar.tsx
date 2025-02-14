import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Power, Maximize2 } from 'lucide-react';

export function TopBar() {
  const [dateTime, setDateTime] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Added state for menu visibility

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShutdown = () => {
    // Add fade-out animation before closing
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.close();
    }, 300); // Adjust duration as needed
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };


  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-md border-b flex items-center px-2 z-[9999]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 menu-transition"
            onClick={handleMenuOpen}
          >
            <Power className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="menu-transition" onChange={(open) => !open && handleMenuClose()}>
          <DropdownMenuItem onClick={handleRestart}>
            Restart
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShutdown}>
            Shut Down
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 ml-1"
        onClick={toggleFullscreen}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <div className="flex-1" />
      <div className="text-sm">{dateTime}</div>
    </div>
  );
}