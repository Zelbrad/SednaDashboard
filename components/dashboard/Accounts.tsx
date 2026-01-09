import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '../ui/GlassCard';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, MoreHorizontal, Settings, Trash2, X, AlertTriangle, Check } from 'lucide-react';
import { BalanceCard } from './BalanceCard';

export const Accounts: React.FC = () => {
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [modals, setModals] = useState<{ type: 'remove' | 'customize' | null; accountId: number | null }>({ type: null, accountId: null });
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [customColors, setCustomColors] = useState<Record<number, string>>({});

    const menuRef = useRef<HTMLDivElement>(null);

    // Initial Mock Data
    const [accounts, setAccounts] = useState([
        {
            id: 1,
            name: 'Main Wallet',
            type: 'Crypto',
            balance: '$124,532.00',
            change: '+4.2%',
            isPositive: true,
            address: '0x71C...9A21',
            icon: Wallet,
            defaultColor: 'bg-sedna-accent'
        },
        {
            id: 2,
            name: 'Trading Account',
            type: 'Margin',
            balance: '$42,150.80',
            change: '-1.5%',
            isPositive: false,
            address: '0x3B9...4F82',
            icon: ArrowUpRight,
            defaultColor: 'bg-blue-500'
        },
        {
            id: 3,
            name: 'Savings',
            type: 'Staking',
            balance: '$15,000.00',
            change: '+12.5%',
            isPositive: true,
            address: '0x9D2...1E56',
            icon: CreditCard,
            defaultColor: 'bg-green-500'
        }
    ]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const generateVerificationCode = () => {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    const openModal = (type: 'remove' | 'customize', accountId: number) => {
        if (type === 'remove') {
            setVerificationCode(generateVerificationCode());
            setInputCode('');
        }
        setModals({ type, accountId });
        setActiveMenuId(null);
    };

    const closeModal = () => {
        setModals({ type: null, accountId: null });
    };

    const handleRemoveAccount = () => {
        if (inputCode === verificationCode && modals.accountId) {
            setAccounts(prev => prev.filter(acc => acc.id !== modals.accountId));
            closeModal();
        }
    };

    const handleColorChange = (accountId: number, color: string) => {
        setCustomColors(prev => ({ ...prev, [accountId]: color }));
    };

    // Helper to get active color (custom hex or default tailwind class)
    const getAccountColorStyle = (account: typeof accounts[0]) => {
        const custom = customColors[account.id];
        if (custom) return { background: custom, isCustom: true };
        return { className: account.defaultColor, isCustom: false };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Accounts</h2>
                    <p className="text-sedna-textMuted text-sm">Manage your connected wallets and exchanges</p>
                </div>
                <button className="px-4 py-2 bg-sedna-accent text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20 cursor-pointer">
                    Add Account
                </button>
            </div>

            {/* Total Balance Overview */}
            <div className="w-full">
                <BalanceCard />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {accounts.map((account) => {
                    const colorStyle = getAccountColorStyle(account);

                    return (
                        <GlassCard
                            key={account.id}
                            className="p-6 relative group cursor-pointer overflow-hidden transition-all duration-300"
                            style={colorStyle.isCustom ? {
                                background: `linear-gradient(135deg, ${colorStyle.background}DD 0%, ${colorStyle.background}44 100%)`,
                                borderColor: `${colorStyle.background}44`
                            } : undefined}
                        >
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div
                                    className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/5 ${!colorStyle.isCustom && account.defaultColor} bg-opacity-20`}
                                >
                                    <account.icon size={24} className="text-white" />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === account.id ? null : account.id);
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                    {activeMenuId === account.id && (
                                        <div ref={menuRef} className="absolute right-0 top-full mt-2 w-36 bg-[#0f0f13] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openModal('customize', account.id); }}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
                                            >
                                                <Settings size={14} />
                                                Customize
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openModal('remove', account.id); }}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors cursor-pointer text-left"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4 relative z-10">
                                <p className="text-white/60 text-sm font-medium mb-1">{account.name}</p>
                                <h3 className="text-2xl font-bold text-white tracking-tight">{account.balance}</h3>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${account.isPositive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {account.change}
                                    </span>
                                    <span className="text-xs text-white/50">{account.type}</span>
                                </div>
                                <span className="text-xs font-mono text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                    {account.address}
                                </span>
                            </div>

                            {/* Background glow effect - Only for default colors (custom colors handles this via inline style) */}
                            {!colorStyle.isCustom && (
                                <div className={`absolute top-0 right-0 w-32 h-32 ${account.defaultColor} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:opacity-20 transition-opacity`} />
                            )}
                        </GlassCard>
                    );
                })}

                {/* Add New Placeholder */}
                <div className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 min-h-[200px] hover:border-sedna-accent/50 hover:bg-sedna-accent/5 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl text-gray-400 group-hover:text-white">+</span>
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white">Connect New Wallet</span>
                </div>
            </div>

            {/* REMOVE MODAL PORTAL */}
            {modals.type === 'remove' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Remove Account?</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Are you sure you want to remove this account? This action cannot be undone.
                            </p>

                            <div className="w-full bg-white/5 rounded-lg p-3 mb-4 text-center border border-white/5">
                                <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Security Code</span>
                                <span className="text-xl font-mono font-bold text-sedna-accent tracking-widest select-all">
                                    {verificationCode}
                                </span>
                            </div>

                            <div className="w-full mb-6">
                                <label className="text-xs text-gray-500 mb-1.5 block text-left ml-1">Type code to confirm</label>
                                <input
                                    type="text"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    placeholder="Enter 8-digit code"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sedna-accent transition-colors font-mono text-center tracking-widest"
                                    maxLength={8}
                                />
                            </div>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRemoveAccount}
                                    disabled={inputCode !== verificationCode}
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors border border-transparent"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* CUSTOMIZE MODAL PORTAL */}
            {modals.type === 'customize' && modals.accountId && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Customize Wallet</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-3">Card Background Color</label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-xl border-2 border-white/20 shadow-lg"
                                    style={{ background: customColors[modals.accountId] || '#1a1a1a' }}
                                />
                                <div className="flex-1">
                                    <input
                                        type="color"
                                        value={customColors[modals.accountId] || '#1a1a1a'}
                                        onChange={(e) => handleColorChange(modals.accountId!, e.target.value)}
                                        className="w-full h-10 rounded cursor-pointer bg-transparent"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Click to pick a hex color
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
                            className="w-full px-4 py-3 bg-sedna-accent hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg float-right"
                        >
                            Done
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
