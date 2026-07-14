import { useState } from 'react';
import {
  useAdminLogin,
  useAdminListOrders,
  getAdminListOrdersQueryKey,
  useAdminUpdateOrderStatus,
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminDeleteProduct,
  useListProducts,
  getListProductsQueryKey,
  Product,
  Order,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '@/lib/utils';
import { getAdminToken, setAdminToken, clearAdminToken } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

function apiErrorMessage(error: unknown): string {
  return (
    (error as { data?: { error?: string } })?.data?.error ||
    (error instanceof Error ? error.message : 'Something went wrong')
  );
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [password, setPassword] = useState('');
  const login = useAdminLogin();
  const { toast } = useToast();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { password } },
      {
        onSuccess: (session) => {
          setAdminToken(session.token);
          onLoggedIn();
        },
        onError: (error) => {
          toast({ title: 'Login failed', description: apiErrorMessage(error), variant: 'destructive' });
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-sm">
      <h1 className="font-serif text-3xl font-medium mb-8 text-center">Admin</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 h-12"
            autoFocus
          />
        </div>
        <Button type="submit" className="w-full h-12 rounded-full" disabled={login.isPending || !password}>
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Orders tab
// ---------------------------------------------------------------------------

function statusBadgeVariant(status: string) {
  switch (status) {
    case 'paid':
      return 'default' as const;
    case 'pending':
    case 'cancelled':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useAdminUpdateOrderStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const setStatus = (status: string) => {
    updateStatus.mutate(
      { id: order.id, data: { status: status as (typeof ORDER_STATUSES)[number] } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListOrdersQueryKey() });
        },
        onError: (error) => {
          toast({ title: 'Update failed', description: apiErrorMessage(error), variant: 'destructive' });
        },
      }
    );
  };

  return (
    <div className="border border-border rounded-2xl p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <span className="font-medium">#{order.id.toString().padStart(6, '0')}</span>
        <span className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className="text-sm flex-1 min-w-32 truncate">{order.customerName}</span>
        <span className="font-medium">{formatPrice(order.totalCents)}</span>
        {order.paymentMethod && (
          <Badge variant="outline" className="capitalize">{order.paymentMethod}</Badge>
        )}
        <Badge variant={statusBadgeVariant(order.status)} className="capitalize">{order.status}</Badge>
        <Select value={order.status} onValueChange={setStatus} disabled={updateStatus.isPending}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">Items</p>
            <ul className="text-muted-foreground space-y-1">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.product.brand} — {item.product.name}{' '}
                  ({formatPrice(item.priceCentsAtPurchase * item.quantity)})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Delivery</p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress}, {order.city}, {order.postalCode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const { data: orders, isLoading, error } = useAdminListOrders();

  if (error && (error as { status?: number }).status === 401) {
    onUnauthorized();
    return null;
  }
  if (isLoading) return <p className="text-muted-foreground py-8">Loading orders...</p>;
  if (!orders || orders.length === 0) return <p className="text-muted-foreground py-8">No orders yet.</p>;

  return <div className="space-y-3">{orders.map((order) => <OrderRow key={order.id} order={order} />)}</div>;
}

// ---------------------------------------------------------------------------
// Products tab
// ---------------------------------------------------------------------------

interface ProductFormValues {
  name: string;
  brand: string;
  gender: 'men' | 'women' | 'unisex';
  description: string;
  scentNotes: string; // comma separated in the form
  category: string;
  priceEur: string;
  imageUrl: string;
  stock: string;
  featured: boolean;
}

const emptyForm: ProductFormValues = {
  name: '',
  brand: '',
  gender: 'unisex',
  description: '',
  scentNotes: '',
  category: '',
  priceEur: '',
  imageUrl: '',
  stock: '0',
  featured: false,
};

function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    brand: product.brand,
    gender: product.gender,
    description: product.description,
    scentNotes: product.scentNotes.join(', '),
    category: product.category,
    priceEur: (product.priceCents / 100).toFixed(2),
    imageUrl: product.imageUrl,
    stock: String(product.stock),
    featured: product.featured,
  };
}

function toApiPayload(values: ProductFormValues) {
  return {
    name: values.name.trim(),
    brand: values.brand.trim(),
    gender: values.gender,
    description: values.description.trim(),
    scentNotes: values.scentNotes
      .split(',')
      .map((note) => note.trim())
      .filter(Boolean),
    category: values.category.trim(),
    priceCents: Math.round(parseFloat(values.priceEur.replace(',', '.')) * 100),
    imageUrl: values.imageUrl.trim(),
    stock: parseInt(values.stock, 10) || 0,
    featured: values.featured,
  };
}

function ProductDialog({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(product ? toFormValues(product) : emptyForm);
  const createProduct = useAdminCreateProduct();
  const updateProduct = useAdminUpdateProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const set = (patch: Partial<ProductFormValues>) => setValues((v) => ({ ...v, ...patch }));

  const isValid =
    values.name.trim() &&
    values.brand.trim() &&
    values.category.trim() &&
    values.imageUrl.trim() &&
    !isNaN(parseFloat(values.priceEur.replace(',', '.')));

  const onSaved = () => {
    queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
    onClose();
  };
  const onError = (error: unknown) => {
    toast({ title: 'Save failed', description: apiErrorMessage(error), variant: 'destructive' });
  };

  const save = () => {
    const data = toApiPayload(values);
    if (product) {
      updateProduct.mutate({ id: product.id, data }, { onSuccess: onSaved, onError });
    } else {
      createProduct.mutate({ data }, { onSuccess: onSaved, onError });
    }
  };

  const saving = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? `Edit: ${product.name}` : 'New product'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={values.name} onChange={(e) => set({ name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={values.brand} onChange={(e) => set({ brand: e.target.value })} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Gender</Label>
              <Select value={values.gender} onValueChange={(gender) => set({ gender: gender as ProductFormValues['gender'] })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category (slug)</Label>
              <Input
                value={values.category}
                onChange={(e) => set({ category: e.target.value })}
                placeholder="floral, woody, fresh..."
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (€)</Label>
              <Input
                value={values.priceEur}
                onChange={(e) => set({ priceEur: e.target.value })}
                placeholder="29.99"
                inputMode="decimal"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                value={values.stock}
                onChange={(e) => set({ stock: e.target.value })}
                inputMode="numeric"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Image URL</Label>
            <Input
              value={values.imageUrl}
              onChange={(e) => set({ imageUrl: e.target.value })}
              placeholder="/api/images/... or https://..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Scent notes (comma separated)</Label>
            <Input
              value={values.scentNotes}
              onChange={(e) => set({ scentNotes: e.target.value })}
              placeholder="rose, amber, vanilla"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={values.description}
              onChange={(e) => set({ description: e.target.value })}
              rows={3}
              className="mt-1"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => set({ featured: e.target.checked })}
              className="h-4 w-4"
            />
            Featured on homepage
          </label>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={!isValid || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductsTab() {
  const { data: products, isLoading } = useListProducts();
  const deleteProduct = useAdminDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (product: Product) => {
    setEditing(product);
    setDialogOpen(true);
  };

  const remove = (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    deleteProduct.mutate(
      { id: product.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        },
        onError: (error) => {
          toast({ title: 'Delete failed', description: apiErrorMessage(error), variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) return <p className="text-muted-foreground py-8">Loading products...</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openNew} className="rounded-full">
          <Plus className="h-4 w-4 mr-2" />
          New product
        </Button>
      </div>

      <div className="space-y-3">
        {products?.map((product) => (
          <div key={product.id} className="border border-border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 bg-secondary/40 rounded-xl overflow-hidden">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {product.brand} · <span className="capitalize">{product.gender}</span> · {product.category}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-medium">{formatPrice(product.priceCents)}</p>
              <p className={`text-sm ${product.stock === 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                Stock: {product.stock}
              </p>
            </div>
            {product.featured && <Badge variant="secondary">Featured</Badge>}
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(product)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(product)}
                disabled={deleteProduct.isPending}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {dialogOpen && (
        <ProductDialog
          key={editing?.id ?? 'new'}
          product={editing}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => !!getAdminToken());
  const queryClient = useQueryClient();

  const logout = () => {
    clearAdminToken();
    queryClient.removeQueries({ queryKey: getAdminListOrdersQueryKey() });
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <AdminLogin onLoggedIn={() => setLoggedIn(true)} />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium">Store Admin</h1>
        <Button variant="outline" onClick={logout} className="rounded-full">
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <OrdersTab onUnauthorized={logout} />
        </TabsContent>
        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
