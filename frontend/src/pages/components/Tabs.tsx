import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

export function TabsWithIcon() {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  const data = [
    {
      label: "Dashboard",
      value: "dashboard",
      icon: Square3Stack3DIcon,
      desc: `It really matters and then like it really doesn't matter. What matters is the people who are sparked by it.`,
    },
    {
      label: "Profile",
      value: "profile",
      icon: UserCircleIcon,
      desc: `Because it's about motivating the doers. Because I'm here to follow my dreams and inspire other people.`,
    },
    {
      label: "Settings",
      value: "settings",
      icon: Cog6ToothIcon,
      desc: `We're not always in the position that we want to be at. We're constantly growing.`,
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <Tabs
        {...({} as any)}
      >
        <TabsHeader
          className="bg-blue-gray-50"
          indicatorProps={{
            className: "bg-blue-500/10 shadow-none text-blue-500",
          }}
          {...({} as any)}
        >

          {data.map(({ label, value, icon }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setActiveTab(value)}
              {...({} as any)}
            >
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody {...({} as any)}>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  )
}
