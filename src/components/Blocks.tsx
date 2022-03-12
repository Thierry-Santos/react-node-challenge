import React from "react";
import colors from "../constants/colors";
import { Box, Typography, CircularProgress, styled } from "@mui/material";
import { Blocks as BlocksType } from "../types/Block";

type Props = {
  blocks: BlocksType;
};

const BoxContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
  backgroundColor: colors.blocks,
  borderRadius: 2,
  marginBottom: 4,
});

const TypographyIndex = styled(Typography)({
  fontSize: 10,
  color: colors.index,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 4,
  fontWeight: 'bold',
  letterSpacing: 1.5
});

const TypographyDescription = styled(Typography)({
  fontSize: 14,
  color: colors.description,
  paddingLeft: 8,
  paddingRight: 8,
  paddingBottom: 4,
  letterSpacing: 0.25
});

const BoxLoading = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const TypographyError = styled(Typography)({
  color: colors.danger,
  paddingLeft: 10,
});

const formatIndex = (index: Number) => {
  if (index < 10) return '00' + index.toString();
  if (index < 100) return '0' + index.toString();
}

const Blocks: React.FC<Props> = ({ blocks }) => {
  return (
    <>
      {!blocks.loading && blocks.list.map((block: any, j: any) => {
        return (
          <BoxContainer key={j}>
            <TypographyIndex>{formatIndex(block.index)}</TypographyIndex>
            <TypographyDescription>{block.data}</TypographyDescription>
          </BoxContainer>
        )
      })
      }
      {blocks.error &&
        <TypographyError>Faild to fetch blocks!</TypographyError>
      }
      {blocks.loading &&
        <BoxLoading>
          <CircularProgress color='inherit'/>
        </BoxLoading>
      }
    </>
  )
};

export default Blocks;
