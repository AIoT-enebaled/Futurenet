
import React from 'react';
import { SubscriptionPageProps, User, Team, TeamMember } from '../types';
// FIX: Added XCircleIcon to imports
import { CreditCardIcon, StarIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from '../components/icons';
import { Link } from 'react-router-dom';

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ currentUser, onCancelPro, teams, onUpdateTeamMemberProStatus }) => {
  
  const commonCardStyles = "bg-brand-surface p-6 rounded-xl shadow-xl border border-brand-border/30";
  const primaryButtonStyles = "px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const dangerButtonStyles = "px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-[0_0_25px_0px_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-brand-surface";

  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to cancel your Pro subscription? You will lose access to Pro features at the end of your current billing cycle.")) {
      onCancelPro();
    }
  };
  
  // Mock function for team member pro status update
  const toggleTeamMemberPro = (teamId: string, memberId: string, currentStatus: boolean) => {
    if (onUpdateTeamMemberProStatus) {
        onUpdateTeamMemberProStatus(teamId, memberId, !currentStatus);
        alert(`Mock: User ${memberId} in team ${teamId} Pro status toggled to ${!currentStatus}. In a real app, this would update backend and potentially billing.`);
    } else {
        alert(`Mock: Toggle Pro for member ${memberId} in team ${teamId}. (Full func. TBD)`);
    }
  };

  const userOwnedTeams = teams.filter(team => team.members?.some(m => m.id === currentUser.id && m.role === 'owner'));

  return (
    <div className="space-y-10">
      <div className="flex items-center space-x-3">
        <CreditCardIcon className="w-10 h-10 text-brand-purple" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Subscription Management</h1>
          <p className="text-brand-text-muted text-sm sm:text-base">View and manage your GiiT FutureNet Pro subscription.</p>
        </div>
      </div>

      <div className={`${commonCardStyles}`}>
        <h2 className="text-xl font-semibold text-brand-text mb-4">Your Current Plan</h2>
        {currentUser.is_pro_user ? (
          <div className="space-y-3">
            <div className="flex items-center text-lg text-green-400">
              <StarIcon className="w-6 h-6 mr-2 fill-current" />
              <span>GiiT FutureNet Pro Member</span>
            </div>
            <p className="text-brand-text-muted">
              Tier: <span className="font-medium text-brand-text">{currentUser.subscribed_tier === 'pro_individual' ? 'Pro Innovator (Individual)' : currentUser.subscribed_tier === 'pro_team' ? 'Team Accelerator (via Team)' : 'Pro Member'}</span>
            </p>
            {currentUser.pro_expiry_date && (
              <p className="text-brand-text-muted">
                Renews on: <span className="font-medium text-brand-text">{new Date(currentUser.pro_expiry_date).toLocaleDateString()} (Mock Date)</span>
              </p>
            )}
            <p className="text-sm text-brand-text-darker">Thank you for being a Pro member! You have access to all exclusive features including the GenAI Assistant.</p>
            <div className="pt-4">
              <button onClick={handleCancelSubscription} className={dangerButtonStyles}>
                Cancel Subscription
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-lg text-brand-text-muted">You are currently on the <span className="font-semibold text-brand-text">Free Explorer</span> plan.</p>
            <p className="text-sm text-brand-text-darker">Upgrade to Pro to unlock powerful GenAI tools, enhanced collaboration features, and more!</p>
            <div className="pt-4">
              <Link to="/home#pricing" className={primaryButtonStyles}>
                View Pro Plans
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {currentUser.is_pro_user && (currentUser.subscribed_tier === 'pro_team' || currentUser.role === 'admin') && userOwnedTeams.length > 0 && (
        <div className={`${commonCardStyles}`}>
          <h2 className="text-xl font-semibold text-brand-text mb-4">Manage Team Pro Access (Mock)</h2>
          <p className="text-sm text-brand-text-muted mb-4">As a Team Pro subscriber or Admin, you can notionally manage Pro access for your team members below.</p>
            {userOwnedTeams.map(team => (
                <div key={team.id} className="mb-6 p-4 bg-brand-bg rounded-lg border border-brand-border/50">
                    <h3 className="text-lg font-medium text-brand-cyan mb-3">{team.name} - Members</h3>
                    {team.members && team.members.length > 0 ? (
                        <ul className="space-y-2">
                        {team.members.map(member => (
                            <li key={member.id} className="flex items-center justify-between p-2 bg-brand-surface-alt rounded-md">
                            <div className="flex items-center">
                                <img src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&size=32`} alt={member.name} className="w-8 h-8 rounded-full mr-2"/>
                                <div>
                                    <span className="text-sm text-brand-text">{member.name}</span>
                                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${member.role === 'owner' ? 'bg-pink-500/30 text-pink-300' : 'bg-cyan-500/30 text-cyan-300'}`}>{member.role}</span>
                                </div>
                            </div>
                            {member.id !== currentUser.id && ( // Team owner can't revoke their own pro status via this UI
                                <button 
                                    onClick={() => toggleTeamMemberPro(team.id, member.id, member.id === 'user1')} // MOCK: user1 is pro for example
                                    title={member.id === 'user1' ? "Revoke Pro (Mock)" : "Grant Pro (Mock)"}
                                    className={`p-1.5 rounded-full transition-colors text-white ${member.id === 'user1' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {member.id === 'user1' ? <XCircleIcon className="w-4 h-4"/> : <CheckCircleIcon className="w-4 h-4"/>}
                                </button>
                            )}
                            </li>
                        ))}
                        </ul>
                    ) : <p className="text-xs text-brand-text-darker">No members in this team.</p>}
                </div>
            ))}
        </div>
      )}


      <div className={`${commonCardStyles}`}>
        <h2 className="text-xl font-semibold text-brand-text mb-4">Billing History (Mock)</h2>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Date</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Description</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Amount</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-brand-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {currentUser.is_pro_user && currentUser.pro_expiry_date ? (
                <tr>
                  <td className="py-3 px-3 whitespace-nowrap text-sm text-brand-text-muted">{new Date(new Date(currentUser.pro_expiry_date).setFullYear(new Date(currentUser.pro_expiry_date).getFullYear() -1 )).toLocaleDateString()}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-sm text-brand-text">{currentUser.subscribed_tier === 'pro_individual' ? 'Pro Innovator Plan (Annual)' : 'Team Accelerator Plan (Annual)'}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-sm text-brand-text">{currentUser.subscribed_tier === 'pro_individual' ? '$99.00' : '$499.00 (Mock Team)'}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-sm text-green-400">Paid</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 px-3 text-center text-sm text-brand-text-muted">No billing history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
         <p className="text-xs text-brand-text-darker mt-3">This is mock billing data. Actual payment processing is not implemented.</p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
