# Defined in tilt_devnet/docker_images/Dockerfile.lerna
FROM lerna

USER root

WORKDIR /home/node/
USER 1000

COPY --chown=1000:1000 governance/xc_admin governance/xc_admin

RUN npx lerna run build --scope="{crank_executor,crank_pythnet_relayer}" --include-dependencies

WORKDIR /home/node/governance/xc_admin

CMD [ "npx", "node", "packages/crank_executor/lib/index.js" ]
