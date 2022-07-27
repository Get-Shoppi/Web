const SHOPPI_OFFLINE = process.env.NEXT_PUBLIC_SHOPPI_OFFLINE as string;

const Offline = () => {
  const isShoppiOffline = SHOPPI_OFFLINE === "true";

  return <div className={`${isShoppiOffline ? "absolute" : "hidden"} top-o left-0 bg-red-600 w-screen py-2 px-2 rounded-b-lg`}>
    <p className="text-center text-lg font-medium">Shoppi is currently offline. Please come back later!</p>
  </div>
}

export default Offline;
