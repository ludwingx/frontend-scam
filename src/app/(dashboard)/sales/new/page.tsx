"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Plus, Trash2, Truck, Store, Clock, User, Phone, MapPin, MessageCircle, ImageIcon, Search, Map, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Datos de ejemplo para productos y sucursales
const PRODUCTS = [
  { id: 1, name: "Torta Chocolate Premium", price: 120 },
  { id: 2, name: "Torta Vainilla Clásica", price: 100 },
  { id: 3, name: "Torta Red Velvet", price: 150 },
  { id: 4, name: "Torta Tres Leches", price: 130 },
  { id: 5, name: "Cupcakes (6 unidades)", price: 60 },
  { id: 6, name: "Galletas Decoradas (12 unidades)", price: 45 },
  { id: 7, name: "Pastelitos Personalizados", price: 180 },
  { id: 8, name: "Torta Temática Infantil", price: 200 },
];

const BRANCHES = [
  { id: 1, name: "Sucursal Principal", address: "Radial 26, calle 2" },
];

// Componente de placeholder para cuando Google Maps no está disponible
function MapPlaceholder() {
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Mapa no disponible</h3>
      <p className="text-sm text-gray-600 mb-4">
        La funcionalidad del mapa requiere configuración de Google Maps API.
      </p>
      <div className="text-left text-sm bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800">Configuración requerida:</p>
            <ul className="list-disc list-inside text-yellow-700 mt-1 space-y-1">
              <li>Habilita la facturación en Google Cloud Platform</li>
              <li>Activa Maps JavaScript API y Places API</li>
              <li>Configura una API key válida en las variables de entorno</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para el diálogo del mapa con manejo de errores
function MapDialogComponent({ 
  isOpen, 
  onOpenChange, 
  onConfirmLocation, 
  selectedLocation 
}: { 
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLocation: () => void;
  selectedLocation: { lat: number; lng: number; address: string } | null;
}) {
  const [mapError, setMapError] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [googleMapsComponents, setGoogleMapsComponents] = useState<{
    GoogleMap: any;
    Marker: any;
    Autocomplete: any;
  } | null>(null);
  
  // Always define these hooks unconditionally
  const autocompleteRef = useRef<any>(null);
  const [tempSelectedLocation, setTempSelectedLocation] = useState<{ 
    lat: number; 
    lng: number; 
    address: string 
  } | null>(selectedLocation);
  
  // Check if we should load the map
  const shouldLoadMap = !mapError && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Load Google Maps script and components
  useEffect(() => {
    if (!shouldLoadMap) return;
    
    let isMounted = true;
    
    const loadGoogleMaps = async () => {
      try {
        const { 
          GoogleMap, 
          Marker, 
          Autocomplete, 
          useLoadScript 
        } = await import("@react-google-maps/api");
        
        if (isMounted) {
          setGoogleMapsComponents({
            GoogleMap,
            Marker,
            Autocomplete
          });
          setIsScriptLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps components:', error);
        if (isMounted) {
          setMapError(true);
        }
      }
    };
    
    loadGoogleMaps();
    
    return () => {
      isMounted = false;
    };
  }, [shouldLoadMap]);
  
  // Initialize Google Maps script
  const { isLoaded, loadError } = useGoogleMapsScript({
    isEnabled: isScriptLoaded && shouldLoadMap,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"] as const,
  });
  
  // Custom hook to handle Google Maps script loading
  function useGoogleMapsScript({ isEnabled, ...options }: any) {
    const [state, setState] = useState({
      isLoaded: false,
      loadError: null as Error | null,
    });
    
    useEffect(() => {
      if (!isEnabled) return;
      
      let isMounted = true;
      
      const loadScript = async () => {
        try {
          const { useLoadScript } = await import("@react-google-maps/api");
          // This is a dummy component to use the hook
          const ScriptLoader = () => {
            const scriptState = useLoadScript(options);
            
            useEffect(() => {
              if (isMounted) {
                // Ensure we only pass the expected properties
                setState({
                  isLoaded: scriptState.isLoaded,
                  loadError: scriptState.loadError || null,
                });
              }
            }, [scriptState.isLoaded, scriptState.loadError]);
            
            return null;
          };
          
          // Render the component to trigger the hook
          const root = document.createElement('div');
          document.body.appendChild(root);
          const { createRoot } = await import('react-dom/client');
          const reactRoot = createRoot(root);
          reactRoot.render(<ScriptLoader />);
          
          return () => {
            reactRoot.unmount();
            document.body.removeChild(root);
          };
        } catch (error) {
          if (isMounted) {
            setState({
              isLoaded: false,
              loadError: error instanceof Error ? error : new Error('Failed to load Google Maps'),
            });
          }
        }
      };
      
      loadScript();
      
      return () => {
        isMounted = false;
      };
    }, [isEnabled, JSON.stringify(options)]);
    
    return state;
  }

  const onMapClick = useCallback(async (e: any) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setTempSelectedLocation({ lat, lng, address: `Ubicación seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}` });
    }
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setTempSelectedLocation({ 
          lat: 0, 
          lng: 0, 
          address: place.formatted_address 
        });
      }
    }
  };

  const onAutocompleteLoad = (autocomplete: any) => {
    autocompleteRef.current = autocomplete;
  };

  const handleConfirm = () => {
    if (tempSelectedLocation) {
      onConfirmLocation();
    }
    onOpenChange(false);
  };

  // Si hay error o no está cargado, mostrar placeholder
  if (loadError || !isLoaded || mapError) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Seleccionar ubicación</DialogTitle>
          </DialogHeader>
          <MapPlaceholder />
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Destructure components with default values
  const { GoogleMap: GoogleMapComponent = () => <MapPlaceholder />, 
          Marker: MarkerComponent = () => null, 
          Autocomplete: AutocompleteComponent = ({ children }: { children: React.ReactNode }) => <>{children}</> 
        } = googleMapsComponents || {};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seleccionar ubicación en el mapa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isLoaded ? (
            <div className="flex items-center justify-center h-96">
              <p>Cargando mapa...</p>
            </div>
          ) : loadError ? (
            <div className="flex items-center justify-center h-96 text-red-500">
              <p>Error al cargar el mapa. Por favor, intente de nuevo más tarde.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Buscar ubicación:</Label>
                <div className="relative">
                  <AutocompleteComponent
                    onLoad={onAutocompleteLoad}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <Input
                      type="text"
                      placeholder="Buscar dirección..."
                      className="mb-2 w-full"
                      ref={autocompleteRef}
                    />
                  </AutocompleteComponent>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <GoogleMapComponent
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  zoom={12}
                  center={{ lat: -17.3895, lng: -66.1568 }}
                  onClick={onMapClick}
                  onError={() => setMapError(true)}
                >
                  {tempSelectedLocation && (
                    <MarkerComponent
                      position={{ lat: tempSelectedLocation.lat, lng: tempSelectedLocation.lng }}
                    />
                  )}
                </GoogleMapComponent>
              </div>
              
              {tempSelectedLocation && (
                <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded border">
                  <strong>Ubicación seleccionada:</strong><br />
                  {tempSelectedLocation.address}
                </div>
              )}
            </>
          )}
          
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!tempSelectedLocation}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Confirmar ubicación
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function NewSalePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    deliveryType: "pickup",
    deliveryAddress: "",
    branch: "",
    deliveryDate: new Date(),
    deliveryTime: "14:00",
    products: [{ id: "", quantity: 1, personalization: { phrase: "", image: null, cost: 0 } }],
    totalAmount: 0,
    status: "1",
    notes: "",
    advancePayment: 0,
  });

  const [date, setDate] = useState<Date>(new Date());
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica para guardar la venta
  };

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { id: "", quantity: 1, personalization: { phrase: "", image: null, cost: 0 } }]
    }));
  };

  const handleRemoveProduct = (index: number) => {
    if (formData.products.length > 1) {
      const updatedProducts = [...formData.products];
      updatedProducts.splice(index, 1);
      
      const newTotal = calculateTotal(updatedProducts);
      
      setFormData(prev => ({
        ...prev,
        products: updatedProducts,
        totalAmount: newTotal
      }));
    }
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const updatedProducts = [...formData.products];
    
    if (field === 'id') {
      const product = PRODUCTS.find(p => p.id.toString() === value);
      updatedProducts[index] = {
        ...updatedProducts[index],
        id: value,
        price: product ? product.price : 0
      };
    } else if (field === 'quantity') {
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: parseInt(value) || 1
      };
    }
    
    const newTotal = calculateTotal(updatedProducts);
    
    setFormData(prev => ({
      ...prev,
      products: updatedProducts,
      totalAmount: newTotal
    }));
  };

  const handlePersonalizationChange = (index: number, field: string, value: string) => {
    const updatedProducts = [...formData.products];
    
    if (field === 'phrase') {
      updatedProducts[index].personalization.phrase = value;
      updatedProducts[index].personalization.cost = value ? 10 : 0;
    }
    
    const newTotal = calculateTotal(updatedProducts);
    
    setFormData(prev => ({
      ...prev,
      products: updatedProducts,
      totalAmount: newTotal
    }));
  };

  const calculateTotal = (products: any[]) => {
    return products.reduce((total, product) => {
      const productData = PRODUCTS.find(p => p.id.toString() === product.id);
      const productPrice = productData ? productData.price : 0;
      const personalizationCost = product.personalization?.cost || 0;
      return total + (productPrice + personalizationCost) * product.quantity;
    }, 0);
  };

  const handleDeliveryTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryType: value,
      branch: value === 'delivery' ? '' : prev.branch
    }));
  };

  const handleConfirmLocation = () => {
    // Aquí se manejaría la confirmación de la ubicación
    // Por ahora, solo cerramos el diálogo
    setIsMapDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator /> 
            <BreadcrumbItem>
              <BreadcrumbLink href="/sales">Ventas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sales/new">Nueva Venta</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-3xl font-semibold text-gray-900">
          Nueva orden de venta
        </h2>
        <small className="text-sm font-medium text-gray-600">
          Complete la información para crear una nueva orden de venta.
        </small>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Cliente */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre del Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                required
                placeholder="Ej: María González"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Teléfono *</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                required
                placeholder="Ej: 77712345"
              />
            </div>
          </div>
        </div>

        {/* Tipo de Entrega */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4">Tipo de Entrega</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.deliveryType === 'delivery'}
                  onCheckedChange={(checked) => handleDeliveryTypeChange(checked ? 'delivery' : 'pickup')}
                />
                <Label>Servicio de Delivery</Label>
              </div>

              {formData.deliveryType === 'delivery' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección de Entrega *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                        required
                        placeholder="Ej: Av. Siempre Viva 742, Planta Baja"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsMapDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Map className="h-4 w-4" />
                        Mapa
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="branch" className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Sucursal de Recojo *
                  </Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) => setFormData({...formData, branch: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map(branch => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name} - {branch.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Fecha de Entrega *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Hora de Entrega *
                </Label>
                <Select
                  value={formData.deliveryTime}
                  onValueChange={(value) => setFormData({...formData, deliveryTime: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                    <SelectItem value="17:00">05:00 PM</SelectItem>
                    <SelectItem value="18:00">06:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4">Productos</h3>
          <div className="space-y-4">
            {formData.products.map((product, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Producto *</Label>
                    <Select
                      value={product.id}
                      onValueChange={(value) => handleProductChange(index, 'id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCTS.map(product => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} - Bs. {product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cantidad *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtotal</Label>
                    <Input
                      value={product.id ? 
                        `Bs. ${(PRODUCTS.find(p => p.id.toString() === product.id)?.price || 0) * product.quantity}` 
                        : 'Bs. 0'}
                      disabled
                      className="font-medium"
                    />
                  </div>
                </div>

                {/* Personalización */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Personalización (Opcional)
                  </Label>
                  <Textarea
                    placeholder="Escribe la frase para el producto (costo adicional: Bs. 10)"
                    value={product.personalization.phrase}
                    onChange={(e) => handlePersonalizationChange(index, 'phrase', e.target.value)}
                    rows={2}
                  />
                </div>

                {formData.products.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveProduct(index)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddProduct}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Producto
            </Button>
          </div>
        </div>

        {/* Información de Pago y Notas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium mb-4">Información de Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Monto Total</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Bs.</span>
                <Input
                  id="totalAmount"
                  value={formData.totalAmount}
                  disabled
                  className="pl-10 font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="advancePayment">Anticipo (Opcional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Bs.</span>
                <Input
                  id="advancePayment"
                  type="number"
                  min="0"
                  max={formData.totalAmount}
                  value={formData.advancePayment}
                  onChange={(e) => setFormData({...formData, advancePayment: parseFloat(e.target.value) || 0})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Instrucciones especiales, alergias, preferencias, etc."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/sales')}
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Crear Orden de Venta
          </Button>
        </div>
      </form>

      {/* Diálogo del Mapa */}
      <MapDialogComponent
        isOpen={isMapDialogOpen}
        onOpenChange={setIsMapDialogOpen}
        onConfirmLocation={handleConfirmLocation}
        selectedLocation={null}
      />
    </div>
  );
}