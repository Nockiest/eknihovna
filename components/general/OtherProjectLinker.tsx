import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";

const OtherProjectLinker = () => {
    return (
      <Container className="bg-primary-800  px-2 py-4 rounded-md">
        <Typography variant="h6" className="mx-auto text-center"> <u>Další zajímavé projekty na G.O.</u></Typography>
        <Box className='mx-auto'>
          <Box className="flex flex-col w-full align-center m-2 justify-center mx-auto">
            <Typography variant="body1" className="text-center mx-auto">
              Prodej nebo nakup učebnice z druhé ruky!
            </Typography>
            <Box className="w-32 mx-auto">
              <PrimaryButton>
                <Link href="https://burza.gymnazium-opatov.cz/">
                  Burza Učebnic
                </Link>
              </PrimaryButton>
            </Box>
          </Box>
          <Box className="text-center mx-auto">
            <Typography variant="body1">
              Už nikdy nezapomeň na test z chemie!
            </Typography>
            <Box className="w-32 mx-auto">
              <PrimaryButton>
                <Link href="https://www.copisem.cz/">Co píšem</Link>
              </PrimaryButton>
            </Box>
          </Box>
        </Box>
      </Container>
    );
  };
export default OtherProjectLinker;
