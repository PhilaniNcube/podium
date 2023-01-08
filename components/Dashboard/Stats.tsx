const Stats = () => {
  return (
          <div className="w-full px-4">
            <div className="w-full grid grid-cols-3 gap-6">
              <div className="w-full aspect-3 border-4 border-blue-400 rounded-md bg-slate-300 flex justify-center items-center flex-col">
                <p className="text-2xl font-bold text-slate-800 uppercase">Orders</p>
              </div>
              <div className="w-full aspect-3 border-4 border-blue-400 rounded-md bg-slate-300 flex justify-center items-center flex-col">
                <p className="text-2xl font-bold text-slate-800 uppercase">Products</p>
              </div>
              <div className="w-full aspect-3 border-4 border-blue-400 rounded-md bg-slate-300 flex justify-center items-center flex-col">
                <p className="text-2xl font-bold text-slate-800 uppercase">Users</p>
              </div>
            </div>
          </div>
          );
};
export default Stats;
