import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Search, CheckCircle, Clock, ArrowDownToLine } from 'lucide-react';
import { format } from 'date-fns';
import { TradePanel } from './TradePanel';
import { OrderBook } from './OrderBook';

type TransactionType = 'deposit' | 'withdrawal' | 'trade';
type TransactionStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
    id: string;
    type: TransactionType;
    asset: string;
    amount: string;
    value: string;
    date: Date;
    status: TransactionStatus;
    hash?: string;
}

export const Transactions: React.FC = () => {
    const [filter, setFilter] = useState<'all' | TransactionType>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const transactions: Transaction[] = [
        {
            id: 'tx_1',
            type: 'deposit',
            asset: 'BTC',
            amount: '0.045',
            value: '$2,850.32',
            date: new Date(2025, 10, 24, 14, 30),
            status: 'completed',
            hash: '0x3a...9f21'
        },
        {
            id: 'tx_2',
            type: 'trade',
            asset: 'ETH/USDT',
            amount: '1.2',
            value: '$3,420.00',
            date: new Date(2025, 10, 24, 12, 15),
            status: 'completed'
        },
        {
            id: 'tx_3',
            type: 'withdrawal',
            asset: 'SOL',
            amount: '15.0',
            value: '$2,145.00',
            date: new Date(2025, 10, 23, 9, 45),
            status: 'pending',
            hash: '0x8b...4c12'
        },
        {
            id: 'tx_4',
            type: 'trade',
            asset: 'BTC/ETH',
            amount: '0.1',
            value: '$6,400.00',
            date: new Date(2025, 10, 22, 16, 20),
            status: 'completed'
        },
        {
            id: 'tx_5',
            type: 'deposit',
            asset: 'USDC',
            amount: '5000.0',
            value: '$5,000.00',
            date: new Date(2025, 10, 21, 10, 0),
            status: 'completed',
            hash: '0x1c...7d33'
        }
    ];

    const filteredTransactions = transactions.filter(tx => {
        const matchesFilter = filter === 'all' || tx.type === filter;
        const matchesSearch = tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.hash?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getIcon = (type: TransactionType) => {
        switch (type) {
            case 'deposit': return <ArrowDownRight className="text-green-400" size={20} />;
            case 'withdrawal': return <ArrowUpRight className="text-red-400" size={20} />;
            case 'trade': return <RefreshCw className="text-blue-400" size={20} />;
        }
    };

    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Transactions</h2>
                    <p className="text-sedna-textMuted text-sm">View and manage your recent crypto activity</p>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-sedna-glass border border-white/5 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2 text-white cursor-pointer">
                        <ArrowDownToLine size={16} /> {/* Should import if not available, or replace */}
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 space-y-6">
                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex bg-white/5 p-1 rounded-lg backdrop-blur-sm">
                            {(['all', 'deposit', 'withdrawal', 'trade'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${filter === f
                                        ? 'bg-sedna-accent text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search by asset or hash..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sedna-accent w-full md:w-64 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Transactions List */}
                    <GlassCard className="overflow-hidden" hoverEffect={false}>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5 text-left">
                                        <th className="px-6 py-4 text-xs font-semibold text-sedna-textMuted uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-sedna-textMuted uppercase tracking-wider">Asset</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-sedna-textMuted uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-sedna-textMuted uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-sedna-textMuted uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-sedna-textMuted uppercase tracking-wider">Hash</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                        {getIcon(tx.type)}
                                                    </div>
                                                    <span className="text-sm font-medium text-white capitalize">{tx.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-white font-mono">{tx.asset}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                                                        {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{tx.value}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-300">{format(tx.date, 'MMM dd, yyyy')}</span>
                                                    <span className="text-xs text-gray-500">{format(tx.date, 'HH:mm')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(tx.status)}`}>
                                                    {tx.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                    <span className="capitalize">{tx.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {tx.hash ? (
                                                    <span className="text-xs font-mono text-sedna-accent bg-sedna-accent/10 px-2 py-1 rounded cursor-pointer hover:bg-sedna-accent/20 transition-colors">
                                                        {tx.hash}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-600">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredTransactions.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No transactions found matching your criteria.
                            </div>
                        )}
                    </GlassCard>
                </div>

                <div className="xl:col-span-1 space-y-6">
                    <OrderBook />
                    <TradePanel />
                </div>
            </div>
        </div>
    );
};
