function updateUser(
  userId: string,
  token: string,
  xsrfToken: string,
  cookie: string,
  userData: {
    UserName: string;
    Password: string;
    Email: string;
    PhoneNumber: string;
    RoleName: string;
    CompanyId: string;
    IsActived: string;
    AvatarImage: File;
  }
): void {

  const data = new FormData();
  data.append("UserName", userData.UserName);
  data.append("Password", userData.Password);
  data.append("Email", userData.Email);
  data.append("PhoneNumber", userData.PhoneNumber);
  data.append("RoleName", userData.RoleName);
  data.append("CompanyId", userData.CompanyId);
  data.append("IsActived", userData.IsActived);
  data.append("AvatarImage", userData.AvatarImage, userData.AvatarImage.name);

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open("PUT", `https://localhost:5001/api/SuperAdmin/user/${userId}`);
  xhr.setRequestHeader("X-XSRF-TOKEN", xsrfToken);
  xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  xhr.setRequestHeader("Cookie", cookie);

  xhr.send(data);
}

updateUser(
  "3bc93126-c75a-4032-b39d-a6f28f83dc62", 
  "Bearer_token_here", 
  "CfDJ8Mg1cCP9b9JEhYarUpmG34Rh02OUQRJutet8H--iWBUTPeVnod0Av01pJBOEXBMX5ETOaYzqGqEUPJ-LKeax8G65DntTG2v-AqvUrrD0WPqsA4wazaUnoc3cS3AxCIiUDGnkBMNs-Rc7Wq3VU9SULzRGUIz4CZZ9VDo-rl67qdCH38e5a0Ndz201CTbA0OTzww", // xsrfToken
  ".AspNetCore.Antiforgery.BXECBCQ79Sc=CfDJ8Mg1cCP9b9JEhYarUpmG34Qv8BsTdbB5UY2DtGYRZPae7mdxT-b8Cz4G-Y_ATsCw4A79MbgTmZ5o2woq-ZwY2M-aVNPUYEQxothRymn4nZig9DKvP-bkuftd6Hm8UWknY-BhWLJ_57jVSTeaG9_hZaU", // cookie
  {
    UserName: "CaoAdmin2245.work@gmail.com",
    Password: "sadadasdas",
    Email: "vancaopham.work@gmail.com",
    PhoneNumber: "21111212121",
    RoleName: "admin",
    CompanyId: "HCMUTE",
    IsActived: "false",
    AvatarImage:
      (document.getElementById("fileInput") as HTMLInputElement)?.files?.[0] ??
      new File([], ""), 
  }
);
