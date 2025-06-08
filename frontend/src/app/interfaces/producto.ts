export interface Producto {
    id_producto: number, 
    nombre: string, 
    descripcion: string,
    precio_inicial: number, 
    fecha_inicio: Date,
    fecha_fin: Date, 
    valoracion: number, 
    id_usuario: number, 
    id_subcategoria: number,
    finalizado: boolean,
    id_usuario_ganador: number
}
