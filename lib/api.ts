// Server-safe API helpers — no React dependencies
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:9000/api";
};

export async function getAllPropertiesServer(params?: Record<string, string>) {
  const apiUrl = getApiUrl();
  const queryString = params ? new URLSearchParams(params).toString() : "";
  const url = queryString
    ? `${apiUrl}/properties?${queryString}`
    : `${apiUrl}/properties`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `getAllPropertiesServer API Error [${response.status}]: ${response.statusText}`,
      );
      return [];
    }

    const json = await response.json();
    return json?.data || [];
  } catch (error) {
    console.error("getAllPropertiesServer error:", error);
    return [];
  }
}

export async function getPropertyServer(id: string) {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/properties/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(`API Error [${response.status}]: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("getPropertyServer error:", error);
    return null;
  }
}

export async function getProjectsServer() {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/v1/projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `getProjectsServer API Error [${response.status}]: ${response.statusText}`,
      );
      return [];
    }

    const json = await response.json();
    return json?.data || [];
  } catch (error) {
    console.error("getProjectsServer error:", error);
    return [];
  }
}

export async function getProjectBySlugServer(slug: string) {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/v1/projects/slug/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(
        `getProjectBySlugServer API Error [${response.status}]: ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("getProjectBySlugServer error:", error);
    return null;
  }
}

export async function getDevelopersServer() {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/v1/developers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `getDevelopersServer API Error [${response.status}]: ${response.statusText}`,
      );
      return [];
    }

    const json = await response.json();
    return json?.data || [];
  } catch (error) {
    console.error("getDevelopersServer error:", error);
    return [];
  }
}

export async function getDeveloperByIdServer(id: string) {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/v1/developers/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(
        `getDeveloperByIdServer API Error [${response.status}]: ${response.statusText}`,
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("getDeveloperByIdServer error:", error);
    return null;
  }
}
