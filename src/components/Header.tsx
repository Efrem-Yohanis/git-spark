import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-border/50 bg-gradient-card backdrop-blur-sm flex items-center px-6 sticky top-0 z-50 shadow-card">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
        <div className="relative">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">MPESA-CVM</h1>
          <div className="absolute -inset-2 bg-gradient-primary opacity-10 blur-xl -z-10" />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-sm hover:text-primary transition-colors cursor-pointer outline-none px-3 py-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20">
          <span className="font-semibold text-foreground">Efrem</span> <span className="text-muted-foreground">|</span> <span className="text-muted-foreground">Admin</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-card border-border/50 shadow-card">
          <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/10">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/10">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/20">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
