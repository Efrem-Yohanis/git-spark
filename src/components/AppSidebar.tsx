import { LayoutDashboard, TrendingUp, Users, Smartphone, Download, UserPlus, UserMinus, ArrowUpCircle, ChevronRight, Database, Settings, Megaphone, Headphones, Gavel, Moon, Lock, Building2, RefreshCw, KeyRound, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const metrics = [
  { title: "Active Total", url: "/metric/active-total", icon: TrendingUp },
  { title: "Active New", url: "/metric/active-new", icon: UserPlus },
  { title: "Active Existing", url: "/metric/active-existing", icon: Users },
  { title: "Active Total Transacting", url: "/metric/active-total-transacting", icon: TrendingUp },
  { title: "Active Existing Transacting", url: "/metric/active-existing-transacting", icon: TrendingUp },
  { title: "Active New Transacting", url: "/metric/active-new-transacting", icon: UserPlus },
  { title: "Active Micro Merchants", url: "/metric/active-micro-merchants", icon: Users },
  { title: "Active Unified Merchants", url: "/metric/active-unified-merchants", icon: Users },
  { title: "Active App Users", url: "/metric/active-app-users", icon: Smartphone },
  { title: "App Downloads", url: "/metric/app-downloads", icon: Download },
  { title: "Non-Gross Adds", url: "/metric/non-gross-adds", icon: UserMinus },
  { title: "Gross Adds", url: "/metric/gross-adds", icon: UserPlus },
  { title: "Top Up", url: "/metric/top-up", icon: ArrowUpCircle },
];


export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className={!open ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border shadow-elegant overflow-hidden">
        {/* Header Section */}
        {open && (
          <div className="px-4 py-3 border-b border-sidebar-border/50">
            <div className="relative inline-block">
              <h2 className="text-base font-bold bg-gradient-primary bg-clip-text text-transparent">
                CVM Metrics
              </h2>
              <div className="absolute -inset-2 bg-gradient-primary opacity-20 blur-xl -z-10" />
            </div>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Real-time analytics</p>
          </div>
        )}

        {/* Navigation Section */}
        <SidebarGroup className={open ? "px-3 py-2" : "px-1 py-2"}>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {/* Dashboard Overview */}
              <SidebarMenuItem className="animate-fade-in">
                <SidebarMenuButton asChild className={`group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300 ${!open ? "justify-center" : ""}`}>
                  <NavLink 
                    to="/" 
                    end
                    className="relative z-10"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-sidebar-primary"
                  >
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                    <LayoutDashboard className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                    {open && <span className="text-sm transition-colors">Dashboard Overview</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Metrics - Collapsible (only when sidebar is open) */}
              {open ? (
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                        <TrendingUp className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                        <span className="text-sm transition-colors">Metrics</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {metrics.map((metric, idx) => (
                          <SidebarMenuSubItem key={metric.title} className="animate-fade-in" style={{ animationDelay: `${idx * 20}ms` }}>
                            <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                              <NavLink
                                to={metric.url}
                                end
                                className="relative z-10"
                                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              >
                                <metric.icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                                <span className="text-xs">{metric.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem className="animate-fade-in">
                  <SidebarMenuButton className="group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300 justify-center">
                    <TrendingUp className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Base Preparation */}
              <SidebarMenuItem className="animate-fade-in">
                <SidebarMenuButton asChild className={`group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300 ${!open ? "justify-center" : ""}`}>
                  <NavLink 
                    to="/base-preparation" 
                    end
                    className="relative z-10"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-sidebar-primary"
                  >
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                    <Database className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                    {open && <span className="text-sm transition-colors">Base Preparation</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Campaign Management - Collapsible with GA Pin Reset submenu */}
              {open ? (
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                        <Megaphone className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                        <span className="text-sm transition-colors">Campaign Management</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem className="animate-fade-in">
                          <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                            <NavLink to="/campaigns/cbe" className="relative z-10" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                              <Building2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                              <span className="text-xs">CBE Campaign</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem className="animate-fade-in">
                          <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                            <NavLink to="/campaigns/winback" className="relative z-10" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                              <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                              <span className="text-xs">Winback Churner</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        {/* GA Pin Reset - Nested Collapsible */}
                        <Collapsible className="group/nested">
                          <SidebarMenuSubItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300 w-full">
                                <KeyRound className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                                <span className="text-xs">GA Pin Reset</span>
                                <ChevronRight className="ml-auto h-3 w-3 transition-transform group-data-[state=open]/nested:rotate-90" />
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub className="ml-3 border-l border-sidebar-border/50">
                                <SidebarMenuSubItem className="animate-fade-in">
                                  <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                                    <NavLink to="/campaigns/ga-pin-reset/pin-reset" className="relative z-10" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                                      <Lock className="h-3 w-3 transition-transform group-hover:scale-110" />
                                      <span className="text-xs">Pin Reset</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuSubItem>
                        </Collapsible>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem className="animate-fade-in">
                  <SidebarMenuButton className="group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300 justify-center">
                    <Megaphone className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Ops Support - Collapsible with Dormant List and Dormant List Performance */}
              {open ? (
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                        <Headphones className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                        <span className="text-sm transition-colors">Ops Support</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem className="animate-fade-in">
                          <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                            <NavLink to="/ops-support/court-issue" className="relative z-10" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                              <Gavel className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                              <span className="text-xs">Court Issue</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem className="animate-fade-in">
                          <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                            <NavLink to="/ops-support/dormant-list" className="relative z-10" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                              <Moon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                              <span className="text-xs">Dormant List</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem className="animate-fade-in">
                          <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                            <NavLink to="/ops-support/dormant-list-performance" className="relative z-10" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                              <BarChart3 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                              <span className="text-xs">Dormant List Performance</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem className="animate-fade-in">
                          <SidebarMenuSubButton asChild className="group relative overflow-hidden hover:bg-sidebar-accent/80 transition-all duration-300">
                            <NavLink to="/ops-support/pinlock" className="relative z-10" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                              <Lock className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                              <span className="text-xs">Pinlock</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem className="animate-fade-in">
                  <SidebarMenuButton className="group relative overflow-hidden rounded-lg hover:bg-sidebar-accent/80 transition-all duration-300 justify-center">
                    <Headphones className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-sidebar-primary" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
