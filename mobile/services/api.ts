import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Detecta la IP del servidor Expo/Metro y usa el mismo host para el backend.
const getBaseUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.debuggerHost ||
    '';

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:8000`;
    }
  }

  if (Platform.OS === 'android') {
    // Android emulator usa esta dirección para acceder al localhost del equipo.
    return 'http://10.0.2.2:8000';
  }

  if (Platform.OS === 'ios') {
    // iOS simulator puede acceder a localhost directamente.
    return 'http://localhost:8000';
  }

  // Fallback a IP de desarrollo en red local.
  return 'http://192.168.100.15:8000';
};

export const BASE_URL = getBaseUrl();

// ── Auth ──────────────────────────────────────────────────────────────────────

export const apiRegister = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const text = await res.text();

  console.log('REGISTER RESPONSE:', text);

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.detail || 'Error al registrar usuario');
    }

    return data;
  } catch {
    throw new Error(`Respuesta inválida del servidor: ${text}`);
  }
};
export const apiLogin = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  });

  const text = await res.text();

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.detail || 'Error al iniciar sesión');
    }

    return data;
  } catch {
    throw new Error(`Respuesta inválida del servidor: ${text}`);
  }
};

export const apiMe = async (token: string) => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Token inválido');
  return res.json();
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const apiSetup = async (token: string, data: {
  materia: string;
  guia_id: string;
  nivel: string;
  horas_dia: string;
  meta: string;
}) => {
  const res = await fetch(`${BASE_URL}/users/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).detail);
  return res.json();
};

export const apiGetGuides = async (token: string) => {
  const res = await fetch(`${BASE_URL}/users/guides`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error obteniendo guías');
  return res.json();
};

