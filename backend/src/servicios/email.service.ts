import nodemailer from 'nodemailer';

//configuracion del transporte
const transporte = nodemailer.createTransport({
    service: 'gmail.com',
    auth: {
        user: 'melisamedinanieto@gmail.com',
        pass: 'rpxf ajpl xjwc ucpx'
    }
});

export const enviarAlertaStock =async (producto: string, cantidad: number): Promise<void> => {

    //contenido del correo
    const mailOptions = {
        from: '"MuebleSys Admin" <melisamedinanieto@gmail.com>',
        to: 'unwooast@gmail.com',// a donde llegara el correo
        subject: `ALERTA: Stock Bajo en ${producto}`,
        html: `
        <div style="font-family: Arial, sans-serif; border: 2px solid #ff6600; padding: 20px;">
        <h2 style="color: #ff6600;">Notificación de Inventario</h2>
        <p>El sistema detectó que el producto <strong>${producto}</strong> llegó a su límite.</p>
        <p>Quedan únicamente: <span style="color: red; font-size: 1.2em;">${cantidad}</span> unidades.</p>
        <br>
        <p>Favor de revisar el seguimiento de insumos con el proveedor.</p>
      </div>
        `
    };

    try {
        //enviamos el correo
        await transporte.sendMail(mailOptions);
        console.log(`Correo enviado con éxito para: ${producto}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};