import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// utils
// routes
import { useRouter } from 'src/routes/hook';
// types
// assets
// components
import { useBoolean } from '@hooks/use-boolean';
import { Alert, AlertTitle, Button, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useMutation } from '@tanstack/react-query';
import { useBeneficiaries } from 'src/api/beneficiaries';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { CAMPAIGN_TYPES, IApiResponseError, ICampaignCreateItem, ICampaignFilterOptions, ICampaignItem } from 'src/types/campaigns';
import CampaignAssignBenficiariesModal from './campaign-assign-beneficiaries-modal';

type Props = {
  currentCampaign?: ICampaignCreateItem;
};

interface FormValues extends ICampaignCreateItem { }

const CampaignForm: React.FC = ({ currentCampaign }: Props) => {
  const [beneficiary, setBeneficiary] = useState<string[]>([]);
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const assignCampaignDialog = useBoolean();
  const { beneficiaries } = useBeneficiaries();
  const { error, isLoading, mutate } = useMutation<
    ICampaignCreateItem,
    IApiResponseError,
    ICampaignCreateItem
  >({
    mutationFn: async () => {

    },
    onError: () => {
      enqueueSnackbar('Error creating project', { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('Project created successfully', { variant: 'success' });
      reset();
    },
  });

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    location: Yup.string().required('Location is required'),
    projectManager: Yup.string().required('Project Manager is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.mixed<any>().nullable().required('Start date is required'),
    endDate: Yup.mixed<any>()
      .nullable()
      .required('End date is required')
      .test(
        'date-min',
        'End date must be later than start date',
        (value, { parent }) => value.getTime() > parent.startDate?.getTime()
      ),
    contractAddress: Yup.string().nullable().required('Contract address is required'),
    owner: Yup.number(),
  });

  const defaultValues = useMemo<FormValues>(
    () => ({

      name: currentCampaign?.name || "",
      startTime: currentCampaign?.startTime || "",
      details: currentCampaign?.details || "",
      transport: currentCampaign?.transport || "",
      type: currentCampaign?.transport ,
      beneficiaries:currentCampaign?.beneficiaries || [""],
}),
  [currentCampaign]
  );

const methods = useForm<FormValues>({
  resolver: yupResolver(NewProjectSchema),
  defaultValues,
});

const { reset, handleSubmit, control, setValue, trigger } = methods;


const onSubmit = useCallback((data: ICampaignItem) =>console.log(data) , []);

const campaignTypeOptions: ICampaignFilterOptions = Object.values(CAMPAIGN_TYPES) as string[];

const handleChange = (event: SelectChangeEvent<typeof beneficiary>) => {
  const {
    target: { value },
  } = event;
  setBeneficiary(
    typeof value === 'string' ? value.split(',') : value,
  );
};



return (
  <FormProvider methods={methods} >
    {error && (
      <Alert severity="error">
        <AlertTitle>Error Creating Campaign</AlertTitle>
        {error?.message}
      </Alert>
    )}
    <CampaignAssignBenficiariesModal
      onClose={assignCampaignDialog.onFalse}
      open={assignCampaignDialog.value}
      onOk={() => {
        console.log('Registered');
      }}
    />
    <Grid container spacing={3}>
      <Grid xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="campaignName" label="Campaign Name" />

            <Controller
              name="startTime"
              control={control}
              render={({ field, fieldState: { error: err } }) => (
                <DateTimePicker
                  {...field}
                  label="Start Time"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!err,
                      helperText: err?.message,
                    },
                  }}
                />
              )}
            />

            <RHFTextField name="location" label="Details" />

            <RHFSelect name="campaignTypes" label="Select Campaign Types">
              {campaignTypeOptions.map((campaign) => (
                <MenuItem key={campaign} value={campaign}>
                  {campaign}
                </MenuItem>
              ))}
            </RHFSelect>


            <RHFSelect name="transport" label="Select Transport ">
              <MenuItem key='solana' value='Solana'>
                Solana
              </MenuItem>
            </RHFSelect>

            <Stack alignItems={'flex-start'}>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={beneficiary}
                onChange={handleChange}
                fullWidth
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: any) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {beneficiaries.map((beneficiary) => (
                  <MenuItem
                    key={beneficiary.name}
                    value={beneficiary.name}
                  >
                    {beneficiary.name}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="text" color="primary" onClick={assignCampaignDialog.onTrue}>
                Register Audiences
              </Button>
            </Stack>
          </Box>



          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="outlined" color="success" loading={isLoading}>
              Create Campaign
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </FormProvider>
);
};

export default memo(CampaignForm);
