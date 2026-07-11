import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Package, Users, Activity, AlertTriangle, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { userService } from "@/services/user.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { PageLoader } from "@/components/shared/LoadingSpinner";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => userService.getDashboardStats(),
  });

  const stats = data?.data;

  if (isLoading) return <PageLoader />;
  if (!stats) return <div className="text-center py-8">Failed to load analytics dashboard stats.</div>;

  const cards = [
    { label: "Total Revenue", value: formatPrice(Number(stats.totalRevenue)), icon: DollarSign, color: "text-green-600 bg-green-50 dark:bg-green-950/20" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
    { label: "Products in Catalog", value: stats.totalProducts, icon: Package, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20" },
    { label: "Registered Users", value: stats.totalUsers, icon: Users, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/20" },
  ];

  // SVG Chart Computations for Monthly Revenue
  const maxRevenue = Math.max(...stats.monthlyRevenue.map(d => d.revenue), 1);
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 20;

  // Generate SVG Points for Line Chart
  const points = stats.monthlyRevenue.map((d, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (stats.monthlyRevenue.length - 1 || 1);
    const y = chartHeight - padding - (d.revenue / maxRevenue) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time store stats and analytics.</p>
        </div>
        {stats.lowStockProducts > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 text-sm font-medium animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <span>{stats.lowStockProducts} products low in stock!</span>
          </div>
        )}
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border rounded-xl p-6 flex justify-between items-center shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Visualizations Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Trend Line Chart */}
        <div className="bg-card border rounded-xl p-6 lg:col-span-2 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            Monthly Revenue Trend
          </h3>
          <div className="w-full overflow-hidden pt-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
              <defs>
                <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.708 0.165 254.624)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="oklch(0.708 0.165 254.624)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--color-border)" strokeWidth="1" />
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4" />

              {/* Area path */}
              {stats.monthlyRevenue.length > 0 && (
                <path
                  d={`M ${padding},${chartHeight - padding} L ${points} L ${chartWidth - padding},${chartHeight - padding} Z`}
                  fill="url(#revenue-gradient)"
                />
              )}

              {/* Line path */}
              <polyline
                fill="none"
                stroke="oklch(0.708 0.165 254.624)"
                strokeWidth="2.5"
                points={points}
              />

              {/* Data points & tooltips */}
              {stats.monthlyRevenue.map((d, i) => {
                const x = padding + (i * (chartWidth - padding * 2)) / (stats.monthlyRevenue.length - 1 || 1);
                const y = chartHeight - padding - (d.revenue / maxRevenue) * (chartHeight - padding * 2);
                return (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={x} cy={y} r="4" fill="oklch(0.708 0.165 254.624)" stroke="var(--color-card)" strokeWidth="1.5" />
                    <text x={x} y={y - 8} textAnchor="middle" className="text-[9px] fill-foreground font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatPrice(d.revenue)}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-4">
              {stats.monthlyRevenue.map((d, idx) => (
                <span key={idx}>{d.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance Sales Distribution */}
        <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Category Performance
          </h3>
          <div className="space-y-4 pt-2">
            {stats.categoryPerformance.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No category sales records yet.</p>
            ) : (
              stats.categoryPerformance.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{cat.category}</span>
                    <span className="font-semibold">{formatPrice(cat.value)}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (cat.value / (stats.totalRevenue || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders table */}
        <div className="bg-card border rounded-xl p-6 lg:col-span-2 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b text-muted-foreground text-xs font-semibold uppercase">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs">{order.id.slice(-8)}</td>
                    <td className="py-3.5 px-4 font-medium">{order.user?.name}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{order._count?.items || 0}</td>
                    <td className="py-3.5 px-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3.5 px-4">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5 text-muted-foreground" />
            Top Selling Products
          </h3>
          <div className="divide-y">
            {stats.topSelling.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No items sold yet.</p>
            ) : (
              stats.topSelling.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">{item.quantity} sold</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
