import { Loader } from "@mantine/core";

const LoadingCenter = () => {
  return (
    <div className={"flex h-screen items-center justify-center"}>
      <Loading />
    </div>
  );
};

export const Loading = () => {
  return <Loader color="violet" size="xl" variant="dots" />;
};

export default LoadingCenter;
