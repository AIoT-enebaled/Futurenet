
import React from 'react';
import { BarChart3Icon, UsersIcon, Edit3Icon, BriefcaseIcon, ActivityIcon } from '../components/icons'; 

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; colorName: 'purple' | 'pink' | 'cyan' | 'green' | 'yellow' }> = ({ title, value, icon: Icon, colorName }) => {
  const colorClasses = {
    purple: { bg: 'bg-brand-purple/10', text: 'text-brand-purple', shadow: 'hover:shadow-glow-purple' },
    pink: { bg: 'bg-brand-pink/10', text: 'text-brand-pink', shadow: 'hover:shadow-glow-pink' },
    cyan: { bg: 'bg-brand-cyan/10', text: 'text-brand-cyan', shadow: 'hover:shadow-glow-cyan' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400', shadow: 'hover:shadow-[0_0_25px_0px_rgba(16,185,129,0.5)]' }, 
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', shadow: 'hover:shadow-[0_0_25px_0px_rgba(234,179,8,0.5)]'}
  };
  const selectedColor = colorClasses[colorName] || colorClasses.purple;


  return (
  <div className={`bg-brand-surface p-5 sm:p-6 rounded-xl shadow-xl flex items-center space-x-4 border border-brand-border/30 ${selectedColor.shadow} transition-all duration-300 ease-in-out transform hover:-translate-y-1`}>
    <div className={`p-3 sm:p-3.5 rounded-lg ${selectedColor.bg}`}>
      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${selectedColor.text}`} />
    </div>
    <div>
      <p className="text-xs sm:text-sm text-brand-text-muted uppercase tracking-wider">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-brand-text">{value}</p>
    </div>
  </div>
  );
};

const ChartPlaceholder: React.FC<{ title: string, className?: string }> = ({ title, className }) => (
  <div className={`bg-brand-surface p-5 sm:p-6 rounded-xl shadow-xl ${className} border border-brand-border/30`}>
    <h3 className="text-lg font-semibold text-brand-text mb-4">{title}</h3>
    <div className="h-64 bg-brand-bg/70 rounded-md flex items-center justify-center border border-brand-border/40">
      <p className="text-brand-text-muted text-sm">Chart Data for {title} (TBD)</p>
    </div>
  </div>
);

const AnalyticsPage: React.FC = () => {
  const totalUsers = "1,258";
  const activeProjects = "76";
  const postsThisMonth = "120";
  const teamEngagement = "High";

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <BarChart3Icon className="w-10 h-10 text-brand-purple" />
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Admin Analytics</h1>
            <p className="text-brand-text-muted text-sm sm:text-base">Overview of GiiT community engagement and activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <StatCard title="Total Users" value={totalUsers} icon={UsersIcon} colorName="purple" />
        <StatCard title="Active Projects" value={activeProjects} icon={BriefcaseIcon} colorName="cyan" />
        <StatCard title="Posts This Month" value={postsThisMonth} icon={Edit3Icon} colorName="pink" />
        <StatCard title="Team Engagement" value={teamEngagement} icon={ActivityIcon} colorName="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <ChartPlaceholder title="User Growth Over Time" className="lg:col-span-1" />
        <ChartPlaceholder title="Post Engagement (Reactions & Comments)" className="lg:col-span-1" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <ChartPlaceholder title="Top Active Teams" className="lg:col-span-1" />
        <ChartPlaceholder title="Content Category Popularity" className="lg:col-span-1" />
      </div>
      
      <div className="bg-brand-surface p-5 sm:p-6 rounded-xl shadow-xl border border-brand-border/30">
        <h3 className="text-lg font-semibold text-brand-text mb-4">Recent Admin Actions (Mock Data)</h3>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
          <table className="min-w-full divide-y divide-brand-border/40">
            <thead className="bg-brand-bg/70">
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Action</th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">User</th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Details</th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-brand-surface divide-y divide-brand-border/30">
              <tr className="hover:bg-brand-surface-alt/30 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text">Blocked User</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">SpamUser123</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">Reason: Violation of ToS</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">2024-03-14</td>
              </tr>
              <tr className="hover:bg-brand-surface-alt/30 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text">Approved Post</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">HelpfulUser</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">"Intro to Quantum Computing"</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">2024-03-13</td>
              </tr>
               <tr className="hover:bg-brand-surface-alt/30 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text">Updated Event</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">Admin GiiT</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">"AI Workshop" - time change</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-brand-text-muted">2024-03-12</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;