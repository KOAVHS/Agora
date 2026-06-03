import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

def send_verification_email(email: str, name: str, token: str):
    verification_url = f"http://192.168.100.15:8000/auth/verify?token={token}"
    
    resend.Emails.send({
        "from": "Agora <onboarding@resend.dev>",
        "to": email,
        "subject": "Verifica tu cuenta en Agora",
        "html": f"""
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #7C3AED;">¡Bienvenido a Agora, {name}!</h1>
            <p style="color: #555;">Gracias por registrarte. Verifica tu cuenta para comenzar.</p>
            <a href="{verification_url}" 
               style="display: inline-block; background: #7C3AED; color: white; 
                      padding: 12px 24px; border-radius: 8px; text-decoration: none;
                      font-weight: bold; margin: 16px 0;">
                Verificar mi cuenta
            </a>
            <p style="color: #999; font-size: 12px;">
                Si no creaste esta cuenta, ignora este email.
            </p>
        </div>
        """,
    })