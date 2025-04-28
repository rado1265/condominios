import Swal from 'sweetalert2'

export const DeleteConfirm = (mensaje: string) => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: '¿Está seguro de la eliminación?',
            text: mensaje,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result: any) => {
            resolve(result.isConfirmed);
        })
    });
}

export const ConfirmMessage = async (title: string, mensaje: string) => {
    try {
        const result = await Swal.fire({
            title: title,
            text: mensaje,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        });
        return result.isConfirmed;
    } catch (error) {
        throw error;
    }
}

export const SuccessMessageConfirm = async (mensaje: string) => {
    try {
        const result = await Swal.fire({
            title: 'Operación exitosa',
            text: mensaje,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
        return result.isConfirmed;
    } catch (error) {
        throw error;
    }
}

export const SuccessMessage = (mensaje: string) => {
    Swal.fire({
        title: 'Operación exitosa',
        text: mensaje,
        icon: 'success',        
        confirmButtonColor: '#3085d6',
    });
}


export const ErrorMessage = (title: string, mensaje: string) => {
    Swal.fire({
        title: title,
        text: mensaje,
        icon: 'info',        
        confirmButtonColor: '#3085d6',
    });
}

