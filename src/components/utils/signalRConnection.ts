import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://conexionresidencial-crfybfadapbwctcy.canadacentral-01.azurewebsites.net/hub/notificaciones", {
        withCredentials: true
    })
    .withAutomaticReconnect()
    .build();

export default connection;
