'use client';

import { useBeneficiary } from 'src/api/beneficiaries';
// mui
import Container from '@mui/material/Container';
// routes
import { paths } from '@routes/paths';
import { useParams } from 'src/routes/hook';
// components
import CustomBreadcrumbs from '@components/custom-breadcrumbs/custom-breadcrumbs';
import { Card, Grid, Stack, Typography } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';

import useProjectContract from '@services/contracts/useProject';
import { memo, useCallback, useEffect } from 'react';
import useBeneficiaryStore from 'src/store/beneficiaries';
import BeneficiariesDetailsCard from './beneficiaries-details-card';
import BeneficiariesDetailsClaimsCard from './beneficiaries-details-claims-card';
import BeneficiaryDetailsTableView from './beneficiaries-details-table-view';
import ProjectsInvolved from './project-involved';

function BeneficiariesDetailsView() {
  const { uuid } = useParams();
  const { beneficiary } = useBeneficiary(uuid as string);
  const settings = useSettingsContext();
  const { getBeneficiaryChainData, projectContractWS: ProjectContractWS } = useProjectContract();
  const { chainData, setChainData } = useBeneficiaryStore((state) => ({
    chainData: state.chainData,
    setChainData: state.setChainData,
  }));
  const handleChainData = useCallback(async () => {
    if (!beneficiary.walletAddress) return;
    if (chainData.isBeneficiary !== null) return;

    const data = await getBeneficiaryChainData(beneficiary.walletAddress);
    setChainData(data);
  }, [beneficiary.walletAddress, chainData.isBeneficiary, getBeneficiaryChainData, setChainData]);

  useEffect(() => {
    handleChainData();
  }, [handleChainData]);

  useEffect(() => {
    ProjectContractWS?.on('BeneficiaryAdded', handleChainData);
    ProjectContractWS?.on('BeneficiaryRemoved', handleChainData);
    ProjectContractWS?.on('ClaimAdjusted', handleChainData);
    ProjectContractWS?.on('ClaimAssigned', handleChainData);
    ProjectContractWS?.on('ClaimProcessed', handleChainData);
    ProjectContractWS?.on('BeneficiaryAdded', handleChainData);

    return () => {
      ProjectContractWS?.removeAllListeners();
    };
  }, [ProjectContractWS, handleChainData]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Beneficiaries: Details"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Details' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid
        container
        spacing={2}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Grid item xs={12} md={7}>
          <BeneficiariesDetailsCard beneficiary={beneficiary} isActive={chainData.isBeneficiary} />
        </Grid>
        <Grid item xs={12} md={5}>
          <BeneficiariesDetailsClaimsCard
            walletAddress={beneficiary?.walletAddress}
            balance={chainData.balance}
            tokenAllowance={chainData.allowance}
          />
        </Grid>
      </Grid>

      <Stack mb={5}>
        <ProjectsInvolved projectsInvolved={beneficiary?.projects} />
      </Stack>

      <Card>
        <Typography variant="subtitle2" sx={{ pl: 5, pt: 3, mb: 2 }}>
          Transaction History
        </Typography>
        <BeneficiaryDetailsTableView data={[]} />
      </Card>
    </Container>
  );
}

export default memo(BeneficiariesDetailsView);
