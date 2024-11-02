import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type WithServerSideProps<P extends { [key: string]: any }> = (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>;

export function withServerSideProps<P extends { [key: string]: any }>(gssp: WithServerSideProps<P>): GetServerSideProps<P> {
  return async (context) => {
    // Add your common logic here
    const commonData = 0   ; { /* your common data */ };

    // Call the wrapped getServerSideProps function
    const result = await gssp(context);

    // Merge the common data with the result
    if ('props' in result) {
      return {
        ...result,
        // props: {
        //   ...result.props,
        //   ...commonData,
        // },
      };
    }

    return result;
  };
}
