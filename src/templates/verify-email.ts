export function verifyAccountTemplate(firstName: string, link: string)  {
  return `
    <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <title>Verificá tu correo - Radar</title>
        </head>
        <body style="margin:0; padding:0; background-color:#0B0F14; font-family: Arial, Helvetica, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F14; padding:40px 0;">
            <tr>
                <td align="center">

                <!-- Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#121821; border-radius:8px; padding:32px;">

                    <!-- Logo / Title -->
                    <tr>
                    <td align="center" style="padding-bottom:24px;">
                        <h1 style="margin:0; font-size:24px; color:#00FFB3;">
                        Radar
                        </h1>
                    </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                    <td style="color:#E6E8EB; font-size:15px; line-height:1.6;">
                        <p style="margin:0 0 16px 0;">
                        Hola <strong>${firstName}</strong> 👋
                        </p>

                        <p style="margin:0 0 24px 0;">
                        Hacé click en el siguiente link para verificar tu correo y tener acceso
                        a todas las funcionalidades de <strong>Radar</strong>.
                        </p>
                    </td>
                    </tr>

                    <!-- Button -->
                    <tr>
                    <td align="center" style="padding-bottom:24px;">
                        <a
                        href="${link}"
                        target="_blank"
                        style="
                            display:inline-block;
                            padding:14px 24px;
                            background-color:#00FFB3;
                            color:#0B0F14;
                            text-decoration:none;
                            font-weight:bold;
                            border-radius:6px;
                            font-size:14px;
                        "
                        >
                        Verificar correo
                        </a>
                    </td>
                    </tr>

                    <!-- Fallback link -->


                </table>

                <!-- Footer -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; margin-top:16px;">
                    <tr>
                    <td align="center" style="color:#6B7280; font-size:11px;">
                        © 2026 Radar. Todos los derechos reservados.
                    </td>
                    </tr>
                </table>

                </td>
            </tr>
            </table>

        </body>
        </html>
  `;
}