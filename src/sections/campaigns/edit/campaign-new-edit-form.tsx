import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import { useParams, useRouter } from 'src/routes/hook';
// types
// assets
// components
import { useBoolean } from '@hooks/use-boolean';
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { paths } from '@routes/paths';
import CampaignsService from '@services/campaigns';
import { useMutation } from '@tanstack/react-query';
import { parseMultiLineInput } from '@utils/strings';
import { parseISO } from 'date-fns';
import { useCampaign, useTransports } from 'src/api/campaigns';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import {
  CAMPAIGN_TYPES,
  IApiResponseError,
  ICampaignCreateItem,
  ICampaignFilterOptions,
} from 'src/types/campaigns';
import CampaignAssignBenficiariesModal from './register-beneficiaries-modal';

type Props = {
  currentCampaign?: ICampaignCreateItem;
};

interface FormValues extends ICampaignCreateItem {}

const CampaignForm: React.FC = ({ currentCampaign }: Props) => {
  const params = useParams();
  const [beneficiary, setBeneficiary] = useState<string[]>([]);
  const { push } = useRouter();
  const { transports } = useTransports();

  const { campaign } = useCampaign(params.id);
  const { enqueueSnackbar } = useSnackbar();
  const assignCampaignDialog = useBoolean();
  const { error, isLoading, mutate } = useMutation<
    ICampaignCreateItem,
    IApiResponseError,
    ICampaignCreateItem
  >({
    mutationFn: async (updateData: ICampaignCreateItem) => {
      const response = await CampaignsService.update(params.id, updateData);
      return response.data;
    },
    onError: () => {
      enqueueSnackbar('Error updating Campaign', { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('Campaign updated successfully', { variant: 'success' });
      reset();
      push(`${paths.dashboard.general.campaigns.list}`);
    },
  });

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string()
      .required('Campaign name is required')
      .min(4, 'Mininum 4 characters')
      .max(24, 'Maximum 15 characters'),
    startTime: Yup.string().required('Start date is required'),
    type: Yup.string().required('Campaign Type is required'),
    details: Yup.string().required('Enter the details for the campaign'),
    audienceIds: Yup.array().required('Select the audience for the campaign'),
    transportId: Yup.number().required('Select the transport for the campaign'),
  });

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: currentCampaign?.name || '',
      startTime: String(currentCampaign?.startTime) || null,
      details: currentCampaign?.details || '',
      transportId: currentCampaign?.transportId || '',
      type: currentCampaign?.type as CAMPAIGN_TYPES,
      audienceIds: currentCampaign?.audienceIds || [''],
    }),
    [currentCampaign]
  );

  const methods = useForm<FormValues>({
    resolver: yupResolver(NewProjectSchema),
    defaultValues,
  });

  const { reset, handleSubmit, control, setValue } = methods;

  const onSubmit = useCallback((data: ICampaignCreateItem) => {
    const formatted = {
      ...data,
      details: parseMultiLineInput(data?.details),
    };
    console.log('FormattedData: ', formatted);
    // mutate(formatted)
  }, []);

  const campaignTypeOptions: ICampaignFilterOptions = Object.values(CAMPAIGN_TYPES) as string[];

  const handleChange = (event: SelectChangeEvent<typeof beneficiary>) => {
    const {
      target: { value },
    } = event;
    setBeneficiary(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    if (campaign) {
      setValue('name', campaign.name || '');
      setValue('startTime', parseISO(campaign.startTime as string));
      const campaignType = (campaign.type as CAMPAIGN_TYPES) || CAMPAIGN_TYPES.EMAIL;
      setValue('type', campaignType);
      const formattedDetails = JSON.stringify(campaign.details || {});
      setValue('details', formattedDetails);
      const audienceNames = campaign.audiences?.map((audience) => audience?.details?.name) || [];
      setValue('audienceIds', audienceNames);
      setValue('transportId', campaign.transport?.name || '');
    }
  }, [campaign, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error">
          <AlertTitle>Error Updating Campaign</AlertTitle>
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
            <Stack direction="column" spacing={3}>
              <Stack direction="row" spacing={2}>
                <RHFTextField name="name" label="Campaign Name" />

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

                <RHFSelect name="type" label="Select Campaign Types">
                  {campaignTypeOptions.map((campaigntype) => (
                    <MenuItem key={campaigntype} value={campaigntype}>
                      {campaigntype}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>

              <Stack>
                <RHFTextField name="details" label="Details" fullWidth multiline />
              </Stack>

              <Stack direction="row">
                <RHFSelect name="transportId" label="Select Transport ">
                  {transports.map((transport) => (
                    <MenuItem key={transport?.name} value="1">
                      {transport?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <Stack>
                  <Select
                    name="audienceIds"
                    multiple
                    value={beneficiary}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value: any) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem key="beneficiary" value="Beneficiary 0">
                      Beneficiary 0
                    </MenuItem>
                  </Select>
                  <Button variant="text" color="primary" onClick={assignCampaignDialog.onTrue}>
                    Register Audiences
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="outlined" color="success" loading={isLoading}>
                Edit Campaign
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default memo(CampaignForm);
