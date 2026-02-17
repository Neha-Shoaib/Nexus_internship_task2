import React from 'react';

interface TabProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
}

interface TabListProps {
  children: React.ReactNode;
}

interface TabPanelProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> & {
  Tab: React.FC<TabProps>;
  TabList: React.FC<TabListProps>;
  TabPanel: React.FC<TabPanelProps>;
} = ({ defaultValue, children, onChange }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <div data-value={activeTab}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, handleTabChange } as any);
        }
        return child;
      })}
    </div>
  );
};

export const TabList: React.FC<{ children: React.ReactNode; activeTab?: string; handleTabChange?: (value: string) => void }> = ({ 
  children, activeTab, handleTabChange 
}) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabProps>(child)) {
          const isActive = activeTab === child.props.value;
          return (
            <button
              onClick={() => handleTabChange?.(child.props.value)}
              className={`flex-1 flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {child.props.icon}
              {child.props.label}
            </button>
          );
        }
        return child;
      })}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ label, icon }) => (
  <span>{label}</span>
);

export const TabPanel: React.FC<TabPanelProps> = ({ value, activeValue, children }) => {
  if (value !== activeValue) return null;
  return <div>{children}</div>;
};

Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanel = TabPanel;
